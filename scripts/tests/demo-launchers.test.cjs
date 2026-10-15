'use strict'
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const vm = require('node:vm')
const { getPnpmInvocation } = require('../pnpm-launcher.cjs')

const root = path.resolve(__dirname, '../..')
const sentinel = 'SYNTHETIC_SECRET_DO_NOT_LOG'
const windows = { platform: 'win32', execPath: 'C:\\Program Files\\nodejs\\node.exe' }

for (const extension of ['js', 'cjs', 'mjs']) {
  test(`JavaScript pnpm .${extension} is passed to Node with unchanged arguments`, () => {
    const cli = `C:\\pnpm folder\\pnpm.${extension}`
    const args = ['dlx', 'a b', '& echo unwanted', '$(unwanted)', '"quoted"']
    assert.deepEqual(getPnpmInvocation(cli, args, windows), {
      command: windows.execPath,
      args: [cli, ...args],
    })
    assert.equal(args.length, 5)
  })
}

test('native Windows pnpm is executed directly, including spaces and shell metacharacters', () => {
  const cli = 'C:\\pnpm & tools\\pnpm.EXE'
  const args = ['dlx', 'a b', '& echo unwanted', '$(unwanted)']
  assert.deepEqual(getPnpmInvocation(cli, args, windows), { command: cli, args })
})

test('POSIX JavaScript and extensionless native pnpm remain supported', () => {
  const runtime = { platform: 'linux', execPath: '/usr/bin/node' }
  assert.deepEqual(getPnpmInvocation('/opt/pnpm/pnpm.cjs', ['dlx'], runtime), {
    command: '/usr/bin/node',
    args: ['/opt/pnpm/pnpm.cjs', 'dlx'],
  })
  assert.deepEqual(getPnpmInvocation('/opt/pnpm/pnpm', ['dlx'], runtime), {
    command: '/opt/pnpm/pnpm',
    args: ['dlx'],
  })
})

for (const cli of [undefined, 'pnpm.exe', 'C:\\pnpm.cmd', 'C:\\pnpm.bat', 'C:\\pnpm.ps1']) {
  test(`unsupported pnpm path ${String(cli)} is rejected without a shell`, () => {
    assert.throws(() => getPnpmInvocation(cli, [], windows), /JavaScript pnpm entry point/)
  })
}

// Execute the real launcher sources, replacing every process, socket and file
// operation. These tests neither start an emulator nor read private config.
function launch(file, options = {}) {
  const runtime = Object.assign(new EventEmitter(), {
    ...windows,
    platform: options.platform || 'win32',
    argv: ['node', file, options.action || 'emulator'],
    env: {
      npm_execpath: options.cli || 'C:\\pnpm folder\\pnpm.exe',
      SOC_LOCAL_DEMO: 'false',
      GCLOUD_PROJECT: 'synthetic-cloud-project',
      FIRESTORE_EMULATOR_HOST: 'synthetic-untrusted-host',
      SOC_DEMO_SHORT_DURATION: 'true',
      SYNTHETIC_SENTINEL: sentinel,
    },
  })
  const calls = []
  const ports = []
  const directories = []
  const logs = []
  const clock = { now: 0, nextId: 0, timers: new Map() }
  const attempts = new Map()
  const setTimer = (fn, delay) => {
    const id = ++clock.nextId
    clock.timers.set(id, { at: clock.now + delay, fn })
    return id
  }
  const requireMock = (name) => {
    if (name === './pnpm-launcher.cjs') {
      return { getPnpmInvocation: (cli, args) => getPnpmInvocation(cli, args, runtime) }
    }
    if (name === 'node:child_process') {
      return {
        spawn(command, args, spawnOptions) {
          if (options.spawnThrows) throw new Error(sentinel)
          const child = new EventEmitter()
          child.kills = []
          child.kill = (signal) => child.kills.push(signal)
          calls.push({ command, args: [...args], options: spawnOptions, child })
          return child
        },
      }
    }
    if (name === 'node:fs') {
      return {
        existsSync: () =>
          file === 'test-emulator.cjs' ? options.exported !== false : options.imported !== false,
        mkdirSync: (...args) => directories.push(args),
      }
    }
    if (name === 'node:net') {
      return {
        createServer() {
          const server = new EventEmitter()
          server.close = (done) => done()
          server.listen = (port, host, ready) => {
            ports.push([port, host])
            const attempt = (attempts.get(port) || 0) + 1
            attempts.set(port, attempt)
            const status = options.portState?.(port, attempt) || 'free'
            if (status === 'pending') return
            if (options.busyPort || status === 'busy')
              queueMicrotask(() => server.emit('error', new Error(sentinel)))
            else ready()
          }
          return server
        },
      }
    }
    if (name === 'node:crypto') return { randomUUID: () => '12345678-synthetic' }
    if (name === 'node:perf_hooks') return { performance: { now: () => clock.now } }
    if (name === 'node:path') return path
    throw new Error('Unexpected test dependency')
  }
  vm.runInNewContext(readFileSync(path.join(root, 'scripts', file), 'utf8'), {
    require: requireMock,
    __dirname: path.join(root, 'scripts'),
    process: runtime,
    console: { info: (...args) => logs.push(args), error: (...args) => logs.push(args) },
    Date: { now: () => clock.now },
    setTimeout: setTimer,
    clearTimeout: (id) => clock.timers.delete(id),
  })
  async function advance(ms) {
    const until = clock.now + ms
    for (;;) {
      const next = [...clock.timers.entries()]
        .filter(([, timer]) => timer.at <= until)
        .sort((left, right) => left[1].at - right[1].at)[0]
      if (!next) break
      const [id, timer] = next
      clock.now = timer.at
      clock.timers.delete(id)
      timer.fn()
      await settle()
    }
    clock.now = until
    await settle()
  }
  return { runtime, calls, ports, directories, logs, advance, clock }
}

const settle = () => new Promise(setImmediate)
const cliArgs = (call) => (call.command.endsWith('node.exe') ? call.args.slice(1) : call.args)

for (const cli of ['C:\\pnpm folder\\pnpm.cjs', 'C:\\pnpm folder\\pnpm.exe']) {
  test(`demo emulator preserves arguments/environment with ${path.win32.extname(cli)}`, async () => {
    const state = launch('demo.cjs', { cli })
    await settle()
    assert.equal(state.calls.length, 1)
    const call = state.calls[0]
    assert.equal(call.command, cli.endsWith('.exe') ? cli : windows.execPath)
    assert.deepEqual(cliArgs(call), [
      'dlx',
      'firebase-tools@14.16.0',
      'emulators:start',
      '--only',
      'firestore',
      '--project',
      'demo-soc-incident-protection',
      '--config',
      'firebase.demo.json',
      '--export-on-exit=' + path.join(root, 'demo-data', 'firestore'),
      '--import=' + path.join(root, 'demo-data', 'firestore'),
    ])
    assert.equal(call.options.cwd, root)
    assert.equal(call.options.shell, false)
    assert.equal(call.options.stdio, 'inherit')
    assert.equal(call.options.windowsHide, true)
    assert.equal(call.options.env.SOC_LOCAL_DEMO, 'true')
    assert.equal(call.options.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8085')
    assert.equal(call.options.env.SOC_DEMO_SHORT_DURATION, 'true')
    assert.equal(call.options.env.SYNTHETIC_SENTINEL, sentinel)
    assert.deepEqual(
      state.ports.map(([port]) => port),
      [8085, 4405, 4505]
    )
    assert.deepEqual(state.logs, [])
  })

  test(`isolated seed/export/reload retains its project and arguments with ${path.win32.extname(cli)}`, async () => {
    const state = launch('test-emulator.cjs', { cli })
    await settle()
    assert.equal(state.calls.length, 1)
    const seed = state.calls[0]
    assert.equal(seed.command, cli.endsWith('.exe') ? cli : windows.execPath)
    assert.ok(cliArgs(seed).includes('firebase-tools@14.16.0'))
    assert.ok(cliArgs(seed).includes('emulators:exec'))
    assert.ok(cliArgs(seed).includes('firebase.test.json'))
    assert.ok(!cliArgs(seed).some((arg) => arg.startsWith('--import=')))
    assert.equal(cliArgs(seed).at(-1), 'node scripts/emulator-probe.cjs seed')
    seed.child.emit('exit', 0)
    seed.child.emit('close', 0)
    await settle()
    assert.equal(state.calls.length, 2)
    const reload = state.calls[1]
    assert.equal(cliArgs(reload).at(-1), 'node scripts/emulator-probe.cjs reload')
    const exported = cliArgs(seed)
      .find((arg) => arg.startsWith('--export-on-exit='))
      .split('=')[1]
    assert.ok(cliArgs(reload).includes('--import=' + exported))
    assert.ok(cliArgs(reload).includes('--export-on-exit=' + exported))
    assert.equal(seed.options.env.GCLOUD_PROJECT, reload.options.env.GCLOUD_PROJECT)
    assert.match(seed.options.env.GCLOUD_PROJECT, /^demo-soc-tests-/)
    assert.equal(seed.options.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8086')
    assert.equal(seed.options.env.SOC_DEMO_SHORT_DURATION, 'false')
    assert.equal(seed.options.env.SYNTHETIC_SENTINEL, sentinel)
    for (const call of state.calls) {
      assert.equal(call.options.shell, false)
      assert.equal(call.options.cwd, root)
      assert.equal(call.options.stdio, 'inherit')
      assert.equal(call.options.windowsHide, true)
    }
    assert.deepEqual(
      state.ports.map(([port]) => port),
      [8086, 4406, 4506, 8086, 4406, 4506, 8086, 4406, 4506]
    )
    reload.child.emit('exit', 0)
    reload.child.emit('close', 0)
    await settle()
    assert.match(state.logs.at(-1)[0], /^PASS: isolated Firestore/)
    assert.equal(state.runtime.listenerCount('SIGINT'), 0)
    assert.ok(!JSON.stringify(state.logs).includes(sentinel))
  })
}

test('first demo startup omits import and backend still uses Node with unchanged arguments', async () => {
  const emulator = launch('demo.cjs', { imported: false })
  const backend = launch('demo.cjs', { action: 'backend' })
  await settle()
  assert.ok(!cliArgs(emulator.calls[0]).some((arg) => arg.startsWith('--import=')))
  assert.equal(backend.calls[0].command, windows.execPath)
  assert.deepEqual(backend.calls[0].args, [
    '--env-file-if-exists=backend/.env',
    'backend/lib/server.js',
  ])
  assert.equal(backend.calls[0].options.env.PORT, '5001')
  assert.equal(backend.calls[0].options.env.CORS_ORIGIN, 'http://localhost:3000')
})

for (const code of [0, 17, null]) {
  test(`demo preserves child exit ${code}`, async () => {
    const state = launch('demo.cjs')
    await settle()
    state.calls[0].child.emit('exit', code)
    assert.equal(state.runtime.exitCode, code ?? 1)
  })
}

for (const file of ['demo.cjs', 'test-emulator.cjs']) {
  for (const platform of ['win32', 'linux']) {
    test(`${file}: ${platform} signals preserve graceful child shutdown`, async () => {
      const state = launch(file, {
        platform,
        cli: platform === 'win32' ? 'C:\\pnpm.exe' : '/opt/pnpm/pnpm.cjs',
      })
      await settle()
      state.runtime.emit('SIGINT')
      if (file === 'demo.cjs') state.runtime.emit('SIGTERM')
      assert.deepEqual(
        state.calls[0].child.kills,
        platform === 'win32' ? [] : file === 'demo.cjs' ? ['SIGINT', 'SIGTERM'] : ['SIGINT']
      )
    })
  }

  for (const spawnThrows of [false, true]) {
    test(`${file}: ${spawnThrows ? 'thrown' : 'emitted'} spawn failure is safe`, async () => {
      const state = launch(file, { spawnThrows })
      await settle()
      if (!spawnThrows) state.calls[0].child.emit('error', new Error(sentinel))
      await settle()
      assert.equal(state.runtime.exitCode, 1)
      assert.ok(!JSON.stringify(state.logs).includes(sentinel))
    })
  }

  test(`${file}: occupied port prevents child creation`, async () => {
    const state = launch(file, { busyPort: true })
    await settle()
    assert.equal(state.calls.length, 0)
    assert.equal(state.runtime.exitCode, 1)
  })
}

for (const code of [23, null]) {
  test(`isolated probe exit ${code} prevents reload and returns failure`, async () => {
    const state = launch('test-emulator.cjs')
    await settle()
    state.calls[0].child.emit('exit', code)
    await settle()
    assert.equal(state.calls.length, 1)
    assert.equal(state.runtime.exitCode, 1)
    assert.equal(state.runtime.listenerCount('SIGINT'), 0)
  })
}

for (const delayedPort of [8086, 4406, 4506]) {
  test(`reload waits for delayed release of port ${delayedPort}`, async () => {
    const state = launch('test-emulator.cjs', {
      portState: (port, attempt) =>
        port === delayedPort && attempt >= 2 && attempt <= 3 ? 'busy' : 'free',
    })
    await settle()
    state.calls[0].child.emit('exit', 0)
    state.calls[0].child.emit('close', 0)
    await settle()
    assert.equal(state.calls.length, 1)
    await state.advance(250)
    assert.equal(state.calls.length, 1)
    await state.advance(250)
    assert.equal(state.calls.length, 2)
    assert.equal(cliArgs(state.calls[1]).at(-1), 'node scripts/emulator-probe.cjs reload')
    assert.deepEqual(state.calls[0].child.kills, [])
    state.calls[1].child.emit('exit', 0)
    state.calls[1].child.emit('close', 0)
    await settle()
    assert.match(state.logs.at(-1)[0], /^PASS: isolated Firestore/)
  })
}

test('child exit alone cannot start reload; wait for close too', async () => {
  const state = launch('test-emulator.cjs')
  await settle()
  state.calls[0].child.emit('exit', 0)
  await settle()
  await state.advance(500)
  assert.equal(state.calls.length, 1)
  state.calls[0].child.emit('close', 0)
  await state.advance(250)
  assert.equal(state.calls.length, 2)
})

for (const mode of ['port', 'close', 'pending-probe']) {
  test(`bounded shutdown timeout for ${mode} retains data and never starts reload`, async () => {
    const state = launch('test-emulator.cjs', {
      portState: (port, attempt) => {
        if (port !== 8086 || attempt < 2 || mode === 'close') return 'free'
        return mode === 'port' ? 'busy' : 'pending'
      },
    })
    await settle()
    state.calls[0].child.emit('exit', 0)
    if (mode !== 'close') state.calls[0].child.emit('close', 0)
    await settle()
    await state.advance(29999)
    assert.equal(state.runtime.exitCode, undefined)
    assert.equal(state.calls.length, 1)
    await state.advance(1)
    assert.equal(state.clock.now, 30000)
    assert.equal(state.runtime.exitCode, 1)
    assert.equal(state.calls.length, 1)
    assert.equal(state.directories.length, 2)
    assert.equal(state.runtime.listenerCount('SIGINT'), 0)
    assert.deepEqual(state.calls[0].child.kills, [])
    assert.match(state.logs.at(-1)[0], /^\[SOC_EMULATOR_SHUTDOWN_TIMEOUT\]/)
    assert.ok(!JSON.stringify(state.logs).includes(sentinel))
    assert.ok(!state.logs.some(([line]) => line.startsWith('PASS: isolated Firestore')))
  })
}

test('missing seed export metadata prevents reload even when shutdown succeeds', async () => {
  const state = launch('test-emulator.cjs', { exported: false })
  await settle()
  state.calls[0].child.emit('exit', 0)
  state.calls[0].child.emit('close', 0)
  await settle()
  assert.equal(state.runtime.exitCode, 1)
  assert.equal(state.calls.length, 1)
  assert.equal(state.directories.length, 2)
  assert.match(state.logs.at(-1)[0], /^\[SOC_EMULATOR_EXPORT_MISSING\]/)
})

test('reload also requires complete shutdown before the final PASS', async () => {
  const state = launch('test-emulator.cjs', {
    portState: (port, attempt) => (port === 8086 && attempt >= 4 ? 'busy' : 'free'),
  })
  await settle()
  state.calls[0].child.emit('exit', 0)
  state.calls[0].child.emit('close', 0)
  await settle()
  assert.equal(state.calls.length, 2)
  state.calls[1].child.emit('exit', 0)
  state.calls[1].child.emit('close', 0)
  await settle()
  await state.advance(30000)
  assert.equal(state.runtime.exitCode, 1)
  assert.match(state.logs.at(-1)[0], /^\[SOC_EMULATOR_SHUTDOWN_TIMEOUT\]/)
  assert.ok(!state.logs.some(([line]) => line.startsWith('PASS: isolated Firestore')))
})
