'use strict'
const { spawn } = require('node:child_process')
const { randomUUID } = require('node:crypto')
const { mkdirSync } = require('node:fs')
const net = require('node:net')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const cli = process.env.npm_execpath
if (!cli) {
  console.error('Use pnpm run test:emulator')
  process.exit(1)
}
const project = 'demo-soc-tests-' + Date.now() + '-' + randomUUID().slice(0, 8)
const base = path.join(root, '.emulator-tests')
const data = path.join(base, project)
const env = {
  ...process.env,
  SOC_LOCAL_DEMO: 'true',
  GCLOUD_PROJECT: project,
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8086',
  SOC_TEST_MARKER: path.join(data, 'marker.json'),
  SOC_DEMO_SHORT_DURATION: 'false',
}
function available(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', () => reject(new Error('Test port ' + port + ' is unavailable')))
    server.listen(port, '127.0.0.1', () => server.close(resolve))
  })
}
async function run(phase) {
  // Refuse to reuse another emulator, including one on the hub/logging ports.
  await Promise.all([8086, 4406, 4506].map(available))
  console.info('Starting isolated Firestore ' + phase + ' phase.')
  return new Promise((resolve, reject) => {
    const args = [
      cli,
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
    const child = spawn(process.execPath, args, {
      cwd: root,
      env,
      stdio: 'inherit',
      windowsHide: true,
    })
    const stop = () => {
      if (process.platform !== 'win32') child.kill('SIGINT')
    }
    const cleanup = () => process.removeListener('SIGINT', stop)
    process.once('SIGINT', stop)
    child.once('error', (error) => {
      cleanup()
      reject(error)
    })
    child.once('exit', (code) => {
      cleanup()
      code === 0 ? resolve() : reject(new Error('Emulator ' + phase + ' phase failed'))
    })
  })
}
async function main() {
  mkdirSync(base, { recursive: true })
  // An exclusive directory prevents an existing export from ever being reused.
  mkdirSync(data)
  await run('seed')
  await run('reload')
  console.info(
    'PASS: isolated Firestore transactions, rejection/cancellation/history/audit persistence and restart safeguards. No live Tide/JWT/Fabric verification.'
  )
}
main().catch((error) => {
  const portFailure = /^Test port [0-9]+ is unavailable$/.test(error.message || '')
  console.error(
    portFailure
      ? error.message + '; stop that test process gracefully or use another terminal later.'
      : 'Isolated emulator verification failed or tooling unavailable. Existing demo data was not reset.'
  )
  process.exitCode = 1
})
