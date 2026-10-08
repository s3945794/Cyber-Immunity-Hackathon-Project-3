'use strict'
const { spawn } = require('node:child_process')
const { existsSync } = require('node:fs')
const path = require('node:path')
const { createServer } = require('node:net')
const root = path.resolve(__dirname, '..')
const action = process.argv[2]
const cli = process.env.npm_execpath
if (!cli) {
  console.error('Run through pnpm run demo:emulator or demo:backend.')
  process.exit(1)
}
const env = {
  ...process.env,
  SOC_LOCAL_DEMO: 'true',
  GCLOUD_PROJECT: 'demo-soc-incident-protection',
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085',
  SOC_DEMO_SHORT_DURATION: process.env.SOC_DEMO_SHORT_DURATION === 'true' ? 'true' : 'false',
}
async function unused(port) {
  await new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', () =>
      reject(new Error('Demo port is in use; leave existing processes untouched.'))
    )
    server.listen(port, '127.0.0.1', () => server.close(resolve))
  })
}
async function main() {
  let args
  if (action === 'emulator') {
    for (const port of [8085, 4405, 4505]) await unused(port)
    const data = path.join(root, 'demo-data', 'firestore')
    args = [
      cli,
      'dlx',
      'firebase-tools@14.16.0',
      'emulators:start',
      '--only',
      'firestore',
      '--project',
      env.GCLOUD_PROJECT,
      '--config',
      'firebase.demo.json',
      '--export-on-exit=' + data,
    ]
    if (existsSync(path.join(data, 'firebase-export-metadata.json'))) args.push('--import=' + data)
  } else if (action === 'backend') {
    args = ['--env-file-if-exists=backend/.env', 'backend/lib/server.js']
    // CLI switches override private cloud/project values for this explicit demo process.
    env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'
    env.PORT = '5001'
  } else throw new Error('Unknown demo command')
  const child = spawn(process.execPath, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    windowsHide: true,
  })
  // Windows console Ctrl+C reaches inherited child processes. Node kill() would
  // terminate them forcibly on Windows and can interrupt emulator export.
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.once(signal, () => {
      if (process.platform !== 'win32') child.kill(signal)
    })
  child.once('error', () => {
    console.error('Demo tooling could not start.')
    process.exitCode = 1
  })
  child.once('exit', (code) => {
    process.exitCode = code ?? 1
  })
}
main().catch(() => {
  console.error('Demo startup unavailable. Check ports and pinned tooling access.')
  process.exitCode = 1
})
