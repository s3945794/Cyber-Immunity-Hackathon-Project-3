'use strict'
const path = require('node:path')

/** Choose an executable without passing a command string to a shell. */
function getPnpmInvocation(cli, args, runtime = process) {
  const paths = runtime.platform === 'win32' ? path.win32 : path.posix
  if (typeof cli === 'string' && paths.isAbsolute(cli)) {
    const extension = paths.extname(cli).toLowerCase()
    if (['.js', '.cjs', '.mjs'].includes(extension)) {
      return { command: runtime.execPath, args: [cli, ...args] }
    }
    if (
      (runtime.platform === 'win32' && extension === '.exe') ||
      (runtime.platform !== 'win32' && extension === '')
    ) {
      return { command: cli, args: [...args] }
    }
  }
  // Batch/PowerShell shims require a shell. Refuse them rather than interpolate
  // paths or arguments; npm_execpath should identify the underlying CLI entry.
  throw new Error('Use a JavaScript pnpm entry point or a native pnpm executable.')
}

module.exports = { getPnpmInvocation }
