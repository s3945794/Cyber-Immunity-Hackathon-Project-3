import { createConnection } from 'node:net'
import { createApp } from './app'
import { getDemoConfig } from './lib/demoConfig'
import { loadTideCloakConfig } from './lib/tidecloakConfig'

const startupDiagnostics = {
  configuration:
    '[SOC_STARTUP_CONFIG] Check explicit local demo settings and the valid non-Tide backend port.',
  emulator: '[SOC_STARTUP_EMULATOR] Check that the configured local Firestore emulator is ready.',
  adapter:
    '[SOC_STARTUP_ADAPTER] Check your own Tide adapter presence and format; do not share its contents.',
  application:
    '[SOC_STARTUP_APPLICATION] Check the local backend build and application setup before retrying.',
  binding:
    '[SOC_STARTUP_BIND] Check backend port availability and permissions; leave unrelated processes running.',
} as const

let startupStage: keyof typeof startupDiagnostics = 'configuration'

function reportStartupFailure(): void {
  // Only fixed messages leave this boundary. Never log the caught error/cause.
  console.error(startupDiagnostics[startupStage])
  process.exitCode = 1
}

async function start(): Promise<void> {
  const demo = getDemoConfig()
  if (!demo) throw new Error('Native demo listener requires SOC_LOCAL_DEMO=true')
  const port = Number(process.env.PORT || 5001)
  if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 8080) {
    throw new Error('Invalid backend port')
  }
  const host = process.env.SOC_CONTAINER === 'true' ? '0.0.0.0' : '127.0.0.1'
  startupStage = 'emulator'
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
  startupStage = 'adapter'
  loadTideCloakConfig() // Normal configured runtime; never print the adapter.
  startupStage = 'application'
  const app = createApp()
  startupStage = 'binding'
  const server = app.listen(port, host, () => {
    console.info('SOC local backend ready; Tide evidence authority unavailable')
  })
  server.once('error', reportStartupFailure)
  const stop = () => server.close(() => process.exit(0))
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
}

void start().catch(reportStartupFailure)
