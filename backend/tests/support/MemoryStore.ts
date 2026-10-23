import type { DocumentStore, StoreTransaction, Row } from '../../src/access/store'
/** Test fixture ONLY; production cannot select an in-memory store. */
export class MemoryStore implements DocumentStore {
  readonly rows = new Map<string, Row>()
  private tail: Promise<unknown> = Promise.resolve()
  transaction<T>(work: (tx: StoreTransaction) => Promise<T>): Promise<T> {
    const run = this.tail.then(async () => {
      const pending = new Map<string, Row>()
      const result = await work({
        get: async (c, id) => structuredClone(this.rows.get(c + '/' + id) ?? null),
        set: (c, id, data) => {
          pending.set(c + '/' + id, structuredClone(data))
        },
        create: (c, id, data) => {
          const key = c + '/' + id
          if (this.rows.has(key) || pending.has(key)) throw new Error('Duplicate create')
          pending.set(key, structuredClone(data))
        },
      })
      for (const [k, v] of pending) this.rows.set(k, v)
      return result
    })
    this.tail = run.catch(() => {})
    return run
  }
  async list(collection: string, filters: Record<string, string>, before?: string) {
    return [...this.rows.entries()]
      .filter(
        ([key, row]) =>
          key.startsWith(collection + '/') &&
          Object.entries(filters).every(([k, v]) => row[k] === v)
      )
      .map(([key, row]) => ({ ...structuredClone(row), id: key.split('/')[1]! }))
      .sort(
        (a, b) =>
          Number(b.createdAt) - Number(a.createdAt) || String(b.id).localeCompare(String(a.id))
      )
      .filter((r) => {
        if (!before) return true
        const [at, id] = before.split(':')
        return (
          Number(r.createdAt) < Number(at) ||
          (r.createdAt === Number(at) && String(r.id) < (id ?? ''))
        )
      })
      .slice(0, 51)
  }
}
