export const DEMO_PROJECT_ID = 'demo-soc-incident-protection'

/** A demo can never select a cloud project or silently omit its emulator. */
export function getDemoConfig(env: NodeJS.ProcessEnv = process.env) {
  if (env.SOC_LOCAL_DEMO !== 'true') {
    if (env.FIRESTORE_EMULATOR_HOST) throw new Error('Emulator requires explicit local demo mode')
    return null
  }
  const projectId = env.GCLOUD_PROJECT
  if (projectId !== DEMO_PROJECT_ID && !/^demo-soc-tests-[a-z0-9-]{1,50}$/.test(projectId ?? '')) {
    throw new Error('Local demo requires the dedicated demo project')
  }
  const host = env.FIRESTORE_EMULATOR_HOST
  if (!/^(127\.0\.0\.1|localhost|firestore):[0-9]{2,5}$/.test(host ?? '')) {
    throw new Error('Local demo requires a loopback or internal Firestore emulator')
  }
  const port = Number(host?.split(':')[1])
  if (port === 8080 || port < 1024 || port > 65535) {
    throw new Error('Invalid emulator port; 8080 is reserved for TideCloak')
  }
  return {
    projectId: projectId!,
    host: host!,
    shortDuration: env.SOC_DEMO_SHORT_DURATION === 'true',
  }
}
