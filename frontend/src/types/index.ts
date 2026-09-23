export type * from './auth'

/** Generic Server Action response shape */
export interface ActionResult<T = undefined> {
  success: boolean
  error?: string
  data?: T
}
