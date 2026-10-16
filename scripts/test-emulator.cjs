'use strict'
const { spawn } = require('node:child_process')
const { randomUUID } = require('node:crypto')
const { existsSync, mkdirSync } = require('node:fs')
const net = require('node:net')
const path = require('node:path')
const { performance } = require('node:perf_hooks')
const { getPnpmInvocation } = require('./pnpm-launcher.cjs')
const root = path.resolve(__dirname, '..')
const cli = process.env.npm_execpath
if (!cli) {
  console.error('Use pnpm run test:emulator')
  process.exit(1)
}
const project = 'demo-soc-tests-' + Date.now() + '-' + randomUUID().slice(0, 8)
const base = path.join(root, '.emulator-tests')
const data = path.join(base, project)
const ports = [8086, 4406, 4506]
const shutdownTimeoutMs = 30000
const shutdownPollMs = 250
const portProbeTimeoutMs = 1000
const shutdownTimeoutMessage =
  '[SOC_EMULATOR_SHUTDOWN_TIMEOUT] CLI closure and free test ports 8086/4406/4506 were not confirmed within 30 seconds. Retain exported data and identify any remaining port owner locally before rerunning; no process was killed.'
const exportMissingMessage =
  '[SOC_EMULATOR_EXPORT_MISSING] Seed export metadata is missing; reload was not started. Retain this run data and check the export result.'
const env = {
  ...process.env,
  SOC_LOCAL_DEMO: 'true',
  GCLOUD_PROJECT: project,
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8086',
  SOC_TEST_MARKER: path.join(data, 'marker.json'),
  SOC_DEMO_SHORT_DURATION: 'false',
}
function available(port, timeoutMs = portProbeTimeoutMs) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    const failure = () => new Error('Test port ' + port + ' is unavailable')
    const timer = setTimeout(() => {
      server.close(() => {})
      reject(failure())
    }, timeoutMs)
    const finish = (error) => {
      clearTimeout(timer)
      if (error) reject(failure())
      else resolve()
    }
    server.once('error', finish)
    // Availability requires successfully binding AND releasing the probe socket.
    server.listen(port, '127.0.0.1', () => server.close(finish))
  })
}
async function waitForShutdown(closed) {
  const deadline = performance.now() + shutdownTimeoutMs
  for (;;) {
    const remaining = deadline - performance.now()
    if (remaining <= 0) throw new Error(shutdownTimeoutMessage)
    if (closed()) {
      try {
        await Promise.all(
          ports.map((port) => available(port, Math.min(portProbeTimeoutMs, remaining)))
        )
        if (performance.now() < deadline) return
      } catch {
        // A closed CLI does not establish that its Java descendant released ports.
        // Never inspect/kill an arbitrary port owner; only retry bounded probes.
      }
    }
    const delay = Math.min(shutdownPollMs, deadline - performance.now())
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay))
  }
}
async function run(phase) {
  // Refuse to reuse another emulator, including one on the hub/logging ports.
  await Promise.all(ports.map((port) => available(port)))
  console.info('Starting isolated Firestore ' + phase + ' phase.')
  return new Promise((resolve, reject) => {
    const args = [
      'dlx',
      'firebase-tools@14.16.0',
      'emulators:exec',
      '--only',
      'firestore',
      '--project',
      project,
      '--config',
      'firebase.test.json',
      '--export-on-exit=' + path.join(data, 'export'),
    ]
    if (phase === 'reload') args.push('--import=' + path.join(data, 'export'))
    args.push('node scripts/emulator-probe.cjs ' + phase)
    const invocation = getPnpmInvocation(cli, args)
    const child = spawn(invocation.command, invocation.args, {
      cwd: root,
      env,
      stdio: 'inherit',
      windowsHide: true,
      shell: false,
    })
    const stop = () => {
      if (process.platform !== 'win32') child.kill('SIGINT')
    }
    const cleanup = () => process.removeListener('SIGINT', stop)
    process.once('SIGINT', stop)
    let closed = false
    let failed = false
    child.once('close', () => {
      closed = true
    })
    child.once('error', (error) => {
      failed = true
      cleanup()
      reject(error)
    })
    child.once('exit', (code) => {
      if (failed) return
      if (code !== 0) {
        cleanup()
        reject(new Error('Emulator ' + phase + ' phase failed'))
        return
      }
      console.info('Waiting for isolated Firestore ' + phase + ' shutdown and free test ports.')
      Promise.resolve()
        .then(() => waitForShutdown(() => closed))
        .then(() => {
          cleanup()
          resolve()
        })
        .catch((error) => {
          cleanup()
          reject(error)
        })
    })
  })
}
async function main() {
  mkdirSync(base, { recursive: true })
  // An exclusive directory prevents an existing export from ever being reused.
  mkdirSync(data)
  await run('seed')
  // The directory is unique to this run, so a previous run cannot supply this file.
  if (!existsSync(path.join(data, 'export', 'firebase-export-metadata.json'))) {
    throw new Error(exportMissingMessage)
  }
  await run('reload')
  console.info(
    'PASS: isolated Firestore transactions, rejection/cancellation/history/audit persistence and restart safeguards. No live Tide/JWT/Fabric verification.'
  )
}
main().catch((error) => {
  if ([shutdownTimeoutMessage, exportMissingMessage].includes(error.message)) {
    console.error(error.message)
    process.exitCode = 1
    return
  }
  const portFailure = /^Test port [0-9]+ is unavailable$/.test(error.message || '')
  console.error(
    portFailure
      ? error.message + '; stop that test process gracefully or use another terminal later.'
      : 'Isolated emulator verification failed or tooling unavailable. Existing demo data was not reset.'
  )
  process.exitCode = 1
})
