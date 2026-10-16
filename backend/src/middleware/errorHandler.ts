import type { Request, Response, NextFunction } from 'express'
import { HttpError } from '../lib/errors'

/**
 * Global Express error handler — must be registered last in app.ts.
 * Renders every error as RFC 9457 Problem Details: { type, title, status, detail }
 *
 * HttpError    → rendered as-is
 * Anything else → 500 with a generic message (internals are never exposed to the client)
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const parserError = err as Error & { type?: string }
  const httpError =
    err instanceof HttpError
      ? err
      : parserError.type === 'entity.too.large'
        ? new HttpError(413, 'Payload Too Large', 'Request body is too large')
        : parserError.type === 'entity.parse.failed'
          ? HttpError.badRequest('Invalid JSON body')
          : HttpError.internal()

  if (httpError.status >= 500) {
    // Provider/parser errors may contain payloads or private configuration.
    console.error(`API operation failed (${httpError.status})`)
  }

  res.status(httpError.status).json({
    type: httpError.type,
    title: httpError.title,
    status: httpError.status,
    detail: httpError.detail,
  })
}
