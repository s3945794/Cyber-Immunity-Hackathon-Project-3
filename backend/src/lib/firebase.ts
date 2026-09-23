import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

/**
 * Server-side Firestore access only. Firebase Authentication is not used
 * anywhere in this backend — TideCloak is the sole authentication provider
 * (see middleware/auth.ts, lib/tideJWT.ts). This module exists purely so a
 * future feature (emergency-access request, approval, expiry, audit
 * history) can read/write Firestore from trusted server code, after the
 * TideCloak auth middleware has already verified and authorized the
 * request. The browser never talks to Firestore directly — see
 * firebase/firestore.rules, which denies all direct client access.
 *
 * Initialization is lazy so that `tsc --noEmit` and `next build`/`tsc`
 * never require credentials, and so unit tests never touch the real SDK
 * unless a test explicitly imports this module without mocking it.
 *
 * Credential resolution, in order:
 *   1. Deployed Cloud Functions: no explicit credential is supplied here —
 *      `initializeApp()` falls back to Application Default Credentials,
 *      which the Cloud Functions runtime provides automatically for the
 *      function's runtime service account. No env var is required.
 *   2. Local development only (optional): if
 *      FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is set, it is decoded and used
 *      as an explicit service account credential instead. This is the only
 *      supported way to run this module against a real Firestore project
 *      from a local machine.
 *
 * Never log the decoded credential, the raw env var, or any error object
 * that might embed credential material — catch and rethrow a generic error
 * instead of surfacing SDK internals.
 */

let _adminApp: App | undefined
let _adminDb: Firestore | undefined

function getAdminApp(): App {
  if (_adminApp) return _adminApp

  const existing = getApps()
  if (existing.length > 0) {
    _adminApp = existing[0]!
    return _adminApp
  }

  const encodedKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64

  try {
    _adminApp = encodedKey
      ? initializeApp({
          credential: cert(JSON.parse(Buffer.from(encodedKey, 'base64').toString('utf8'))),
        })
      : initializeApp()
  } catch {
    // Never rethrow the original error — it may embed credential material
    // (e.g. a malformed service account JSON fragment).
    throw new Error(
      'Failed to initialize Firebase Admin. In local development, set ' +
        'FIREBASE_SERVICE_ACCOUNT_KEY_BASE64. In a deployed Cloud Function, ' +
        'Application Default Credentials should be provided automatically.'
    )
  }

  return _adminApp
}

/**
 * Lazily initializes Firebase Admin on first property access, deferring
 * past module load, `tsc --noEmit`, and build time.
 */
function lazyProxy<T extends object>(factory: () => T): T {
  let instance: T | undefined
  return new Proxy({} as T, {
    get(_, prop: string | symbol) {
      instance ??= factory()
      const value = (instance as Record<string | symbol, unknown>)[prop]
      return typeof value === 'function' ? value.bind(instance) : value
    },
  })
}

/** Server-side Firestore client. No route currently uses this — see module doc above. */
export const adminDb: Firestore = lazyProxy(() => {
  _adminDb ??= getFirestore(getAdminApp())
  return _adminDb
})
