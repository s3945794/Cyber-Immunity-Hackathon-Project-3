'use strict'
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const { getPnpmInvocation } = require('./pnpm-launcher.cjs')

// Version-only process probe: no emulator, application or private config reads.
// Require an absolute entry path: pnpm exec does not supply npm_execpath.
try {
  const cli = process.argv[2]
  const invocation = getPnpmInvocation(cli, ['--version'])
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: path.resolve(__dirname, '..'),
    shell: false,
    windowsHide: true,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 10000,
  })
  const version = (result.stdout || '').trim()
  if (result.error || result.status !== 0 || !/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(version)) {
    throw new Error('Version probe failed')
  }
  console.info(
    `PASS: ${process.platform} pnpm ${version}; ${invocation.command === process.execPath ? 'JavaScript' : 'native'} entry; exit 0.`
  )
} catch {
  // Do not relay a child error, path, stdout or stderr on failure.
  console.error(
    '[PNPM_LAUNCH_CHECK_FAILED] Pass an absolute JavaScript pnpm entry or native executable; see the SOC runbook.'
  )
  process.exitCode = 1
}
