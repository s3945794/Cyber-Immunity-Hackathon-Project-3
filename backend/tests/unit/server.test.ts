import { EventEmitter } from 'node:events'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDemoConfig: vi.fn(),
  loadTideCloakConfig: vi.fn(),
  createConnection: vi.fn(),
  createApp: vi.fn(),
  listen: vi.fn(),
}))

vi.mock('../../src/lib/demoConfig', () => ({ getDemoConfig: mocks.getDemoConfig }))
vi.mock('../../src/lib/tidecloakConfig', () => ({
  loadTideCloakConfig: mocks.loadTideCloakConfig,
}))
vi.mock('node:net', () => ({ createConnection: mocks.createConnection }))
vi.mock('../../src/app', () => ({ createApp: mocks.createApp }))

const sentinel = 'SYNTHETIC_SECRET_DO_NOT_LOG'
const privateFailure = () =>
  Object.assign(new Error(sentinel), {
    cause: { adapter: sentinel, headers: { Authorization: sentinel }, credentials: sentinel },
  })

class Socket extends EventEmitter {
  setTimeout = vi.fn()
  destroy = vi.fn()
}

class Server extends EventEmitter {
  close = vi.fn<(done: () => void) => void>()
}

describe('local backend startup diagnostics (all I/O mocked)', () => {
  let socket: Socket
  let server: Server
  let errorLog: ReturnType<typeof vi.spyOn<typeof console, 'error'>>
  let infoLog: ReturnType<typeof vi.spyOn<typeof console, 'info'>>
  let processOnce: ReturnType<typeof vi.spyOn<typeof process, 'once'>>
  let previousExitCode: typeof process.exitCode

  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    previousExitCode = process.exitCode
    process.exitCode = undefined
    vi.stubEnv('PORT', '5001')
    vi.stubEnv('SOC_CONTAINER', 'false')
    socket = new Socket()
    server = new Server()
    mocks.getDemoConfig.mockReturnValue({ host: '127.0.0.1:8085' })
    mocks.createConnection.mockReturnValue(socket)
    mocks.createApp.mockReturnValue({ listen: mocks.listen })
    mocks.listen.mockReturnValue(server)
    errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    infoLog = vi.spyOn(console, 'info').mockImplementation(() => {})
    processOnce = vi.spyOn(process, 'once')
  })

  afterEach(() => {
    for (const [signal, listener] of processOnce.mock.calls) {
      if (signal === 'SIGINT' || signal === 'SIGTERM') process.removeListener(signal, listener)
    }
    process.exitCode = previousExitCode
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  async function launch() {
    // App, adapter and network imports are mocked before evaluating the entry.
    await import('../../src/server')
  }

  async function connected() {
    await launch()
    socket.emit('connect')
    await Promise.resolve()
    await Promise.resolve()
  }

  function expectFailure(code: string) {
    expect(errorLog).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(new RegExp('^\\[' + code + '\\] .+'))
    )
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain(sentinel)
    expect(infoLog).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  }

  it.each(['throw', 'disabled'])('fails closed for demo configuration: %s', async (mode) => {
    if (mode === 'throw')
      mocks.getDemoConfig.mockImplementation(() => {
        throw privateFailure()
      })
    else mocks.getDemoConfig.mockReturnValue(null)
    await launch()
    expectFailure('SOC_STARTUP_CONFIG')
    expect(mocks.createConnection).not.toHaveBeenCalled()
    expect(mocks.loadTideCloakConfig).not.toHaveBeenCalled()
    expect(mocks.createApp).not.toHaveBeenCalled()
  })

  it.each(['0', '1023', '65536', '8080', '3.5', sentinel])(
    'rejects invalid backend port without exposing it: %s',
    async (port) => {
      vi.stubEnv('PORT', port)
      await launch()
      expectFailure('SOC_STARTUP_CONFIG')
      expect(mocks.createConnection).not.toHaveBeenCalled()
      expect(mocks.loadTideCloakConfig).not.toHaveBeenCalled()
      expect(mocks.createApp).not.toHaveBeenCalled()
    }
  )

  it.each(['error', 'timeout'])(
    'emulator %s closes the socket and prevents adapter/app startup',
    async (event) => {
      await launch()
      expect(mocks.createConnection).toHaveBeenCalledWith({ host: '127.0.0.1', port: 8085 })
      expect(socket.setTimeout).toHaveBeenCalledWith(3000)
      socket.emit(event, privateFailure())
      await Promise.resolve()
      await Promise.resolve()
      expectFailure('SOC_STARTUP_EMULATOR')
      expect(socket.destroy).toHaveBeenCalledOnce()
      expect(mocks.loadTideCloakConfig).not.toHaveBeenCalled()
      expect(mocks.createApp).not.toHaveBeenCalled()
    }
  )

  it('synchronous emulator failure uses the same safe diagnostic', async () => {
    mocks.createConnection.mockImplementation(() => {
      throw privateFailure()
    })
    await launch()
    expectFailure('SOC_STARTUP_EMULATOR')
    expect(mocks.loadTideCloakConfig).not.toHaveBeenCalled()
    expect(mocks.createApp).not.toHaveBeenCalled()
  })

  it('adapter validation failure cannot start the app or disclose the error/cause', async () => {
    mocks.loadTideCloakConfig.mockImplementation(() => {
      throw privateFailure()
    })
    await connected()
    expectFailure('SOC_STARTUP_ADAPTER')
    expect(socket.destroy).toHaveBeenCalledOnce()
    expect(mocks.createApp).not.toHaveBeenCalled()
    expect(mocks.listen).not.toHaveBeenCalled()
  })

  it('does not mislabel application construction failure as port binding', async () => {
    mocks.createApp.mockImplementation(() => {
      throw privateFailure()
    })
    await connected()
    expectFailure('SOC_STARTUP_APPLICATION')
    expect(mocks.listen).not.toHaveBeenCalled()
  })

  it('synchronous listen failure has a fixed binding code', async () => {
    mocks.listen.mockImplementation(() => {
      throw privateFailure()
    })
    await connected()
    expectFailure('SOC_STARTUP_BIND')
  })

  it.each(['EADDRINUSE', 'EACCES', sentinel])(
    'listener error %s never prints raw details',
    async (code) => {
      await connected()
      server.emit('error', Object.assign(privateFailure(), { code }))
      expectFailure('SOC_STARTUP_BIND')
    }
  )

  it.each(['false', 'true'])(
    'validated startup preserves binding host (container=%s)',
    async (container) => {
      vi.stubEnv('SOC_CONTAINER', container)
      await connected()
      expect(mocks.loadTideCloakConfig).toHaveBeenCalledOnce()
      expect(mocks.createApp).toHaveBeenCalledExactlyOnceWith()
      expect(mocks.listen).toHaveBeenCalledWith(
        5001,
        container === 'true' ? '0.0.0.0' : '127.0.0.1',
        expect.any(Function)
      )
      mocks.listen.mock.calls[0]?.[2]()
      expect(infoLog).toHaveBeenCalledExactlyOnceWith(
        'SOC local backend ready; Tide evidence authority unavailable'
      )
      expect(errorLog).not.toHaveBeenCalled()
      expect(process.exitCode).toBeUndefined()
    }
  )

  it.each(['SIGINT', 'SIGTERM'])(
    '%s waits for listener close before successful exit',
    async (signal) => {
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
      await connected()
      const stop = processOnce.mock.calls.find(([event]) => event === signal)?.[1]
      expect(stop).toBeDefined()
      stop?.()
      expect(server.close).toHaveBeenCalledOnce()
      expect(exit).not.toHaveBeenCalled()
      server.close.mock.calls[0]?.[0]()
      expect(exit).toHaveBeenCalledExactlyOnceWith(0)
    }
  )
})
