import type { Firestore, Query } from 'firebase-admin/firestore'
import { adminDb } from '../lib/firebase'
import { HttpError } from '../lib/errors'

export type Row = Record<string, unknown>
export interface StoreTransaction {
  get(collection: string, id: string): Promise<Row | null>
  set(collection: string, id: string, data: Row): void
  create(collection: string, id: string, data: Row): void
}
export interface DocumentStore {
  transaction<T>(work: (tx: StoreTransaction) => Promise<T>): Promise<T>
  list(collection: string, filters: Record<string, string>, before?: string): Promise<Row[]>
}

/** The only production store. Writes are buffered until every transaction read completes. */
export class FirestoreStore implements DocumentStore {
  constructor(private readonly db: Firestore = adminDb) {}
  async transaction<T>(work: (tx: StoreTransaction) => Promise<T>): Promise<T> {
    try {
      return await this.db.runTransaction(async (transaction) => {
        const writes: { collection: string; id: string; data: Row; create: boolean }[] = []
        const result = await work({
          get: async (collection, id) => {
            const doc = await transaction.get(this.db.collection(collection).doc(id))
            return doc.exists ? (doc.data() ?? null) : null
          },
          set: (collection, id, data) => writes.push({ collection, id, data, create: false }),
          create: (collection, id, data) => writes.push({ collection, id, data, create: true }),
        })
        for (const w of writes) {
          const ref = this.db.collection(w.collection).doc(w.id)
          if (w.create) transaction.create(ref, w.data)
          else transaction.set(ref, w.data)
        }
        return result
      })
    } catch (error) {
      if (error instanceof HttpError) throw error
      throw HttpError.unavailable(
        'Request storage unavailable. Please retry with the same operation ID.'
      )
    }
  }
  async list(collection: string, filters: Record<string, string>, before?: string): Promise<Row[]> {
    try {
      let query: Query = this.db.collection(collection)
      for (const [field, value] of Object.entries(filters)) query = query.where(field, '==', value)
      query = query.orderBy('createdAt', 'desc').orderBy('__name__', 'desc')
      if (before) {
        const parts = before.split(':')
        const [at, id] = parts
        if (
          parts.length !== 2 ||
          !Number.isSafeInteger(Number(at)) ||
          !/^[0-9]{1,16}$/.test(at ?? '') ||
          !/^[a-zA-Z0-9_-]{1,150}$/.test(id ?? '')
        ) {
          throw HttpError.badRequest('Invalid history cursor')
        }
        query = query.startAfter(Number(at), id)
      }
      const snapshot = await query.limit(51).get()
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    } catch (error) {
      if (error instanceof HttpError) throw error
      throw HttpError.unavailable('History storage unavailable. Please retry.')
    }
  }
}
