import { createConnection } from 'node:net'
import { createApp } from './app'
import { getDemoConfig } from './lib/demoConfig'
import { loadTideCloakConfig } from './lib/tidecloakConfig'

async function start(): Promise<void> {
  const demo = getDemoConfig()
  if (!demo) throw new Error('Native demo listener requires SOC_LOCAL_DEMO=true')
  await new Promise<void>((resolve, reject) => {
    const [host, port] = demo.host.split(':')
    const socket = createConnection({ host, port: Number(port) })
    socket.setTimeout(3000)
    socket.once('connect', () => {
      socket.destroy()
      resolve()
    })
    socket.once('timeout', () => {
      socket.destroy()
      reject(new Error('Emulator unavailable'))
    })
    socket.once('error', () => {
      socket.destroy()
      reject(new Error('Emulator unavailable'))
    })
  })
  loadTideCloakConfig() // Normal configured runtime; never print the adapter.
  const port = Number(process.env.PORT || 5001)
  if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 8080) {
    throw new Error('Invalid backend port')
  }
  const host = process.env.SOC_CONTAINER === 'true' ? '0.0.0.0' : '127.0.0.1'
  const server = createApp().listen(port, host, () => {
    console.info('SOC local backend ready; Tide evidence authority unavailable')
  })
  server.once('error', () => {
    console.error('Backend listener unavailable. Check the configured local port.')
    process.exitCode = 1
  })
  const stop = () => server.close(() => process.exit(0))
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
}

void start().catch(() => {
  console.error('Backend startup failed. Check demo emulator, port and private Tide configuration.')
  process.exitCode = 1
})
