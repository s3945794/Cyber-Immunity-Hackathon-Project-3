import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { join } from 'node:path'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'

const VALID_CONFIG = {
  realm: 'soc-incident-report-protection',
  'auth-server-url': 'http://localhost:8080',
  resource: 'soc-incident-report-protection-app',
  jwk: { keys: [{ kty: 'EC', crv: 'P-256', x: 'x', y: 'y', kid: 'test-key-1' }] },
}

// Repo root is three levels up from backend/tests/unit/lib — used only to
// compute the *expected* path string for assertions below. Nothing in this
// file ever reads or writes an actual file at this location: the real
// data/tidecloak.json (if a developer has exported one locally) must never
// be created, overwritten, or deleted by this test suite.
const REPO_ROOT = join(__dirname, '..', '..', '..', '..')
const EXPECTED_REPO_ROOT_ADAPTER_PATH = join(REPO_ROOT, 'data', 'tidecloak.json')

describe('loadTideCloakConfig', () => {
  beforeEach(() => {
    delete process.env.CLIENT_ADAPTER
  })

  afterEach(() => {
    delete process.env.CLIENT_ADAPTER
  })

  async function freshModule() {
    const mod = await import('../../../src/lib/tidecloakConfig')
    mod.__resetTideCloakConfigCache()
    return mod
  }

  it('loads a valid config from CLIENT_ADAPTER', async () => {
    process.env.CLIENT_ADAPTER = JSON.stringify(VALID_CONFIG)
    const { loadTideCloakConfig } = await freshModule()
    const config = loadTideCloakConfig()
    expect(config.realm).toBe('soc-incident-report-protection')
    expect(config.resource).toBe('soc-incident-report-protection-app')
  })

  it('fails closed when CLIENT_ADAPTER is not valid JSON', async () => {
    process.env.CLIENT_ADAPTER = '{not json'
    const { loadTideCloakConfig } = await freshModule()
    expect(() => loadTideCloakConfig()).toThrow(/not valid JSON/)
  })

  it('fails closed when a required field is missing', async () => {
    const { resource: _omit, ...incomplete } = VALID_CONFIG
    process.env.CLIENT_ADAPTER = JSON.stringify(incomplete)
    const { loadTideCloakConfig } = await freshModule()
    expect(() => loadTideCloakConfig()).toThrow(/resource/)
  })

  it('fails closed when jwk is missing', async () => {
    const { jwk: _omit, ...incomplete } = VALID_CONFIG
    process.env.CLIENT_ADAPTER = JSON.stringify(incomplete)
    const { loadTideCloakConfig } = await freshModule()
    expect(() => loadTideCloakConfig()).toThrow(/jwk/)
  })

  it('fails closed when neither CLIENT_ADAPTER nor the local file is present', async () => {
    // Mocks node:fs so this assertion is deterministic regardless of whether
    // a developer happens to have a real data/tidecloak.json locally (e.g.
    // during manual Phase 2B verification) — it must not depend on the real
    // filesystem's state, and must never read or touch a real adapter file.
    vi.resetModules()
    vi.doMock('node:fs', () => ({
      readFileSync: vi.fn(() => {
        throw new Error('ENOENT: no such file (mocked — no real file present)')
      }),
    }))

    const { loadTideCloakConfig } = await freshModule()
    expect(() => loadTideCloakConfig()).toThrow(/No TideCloak adapter configuration found/)

    vi.doUnmock('node:fs')
    vi.resetModules()
  })

  it('caches the config after the first successful load', async () => {
    process.env.CLIENT_ADAPTER = JSON.stringify(VALID_CONFIG)
    const { loadTideCloakConfig } = await freshModule()
    const first = loadTideCloakConfig()
    delete process.env.CLIENT_ADAPTER
    const second = loadTideCloakConfig()
    expect(second).toBe(first)
  })

  describe('data/tidecloak.json fallback — repo-root resolution (non-destructive)', () => {
    // These tests never touch the real filesystem. `node:fs` is mocked so
    // readFileSync is intercepted before it can reach any real file —
    // the actual data/tidecloak.json (if a developer has one locally) is
    // never created, read for real, overwritten, or deleted here.
    const originalCwd = process.cwd()

    beforeEach(() => {
      vi.resetModules()
      vi.doMock('node:fs', () => ({
        readFileSync: vi.fn(() => JSON.stringify(VALID_CONFIG)),
      }))
    })

    afterEach(() => {
      process.chdir(originalCwd)
      vi.doUnmock('node:fs')
      vi.resetModules()
    })

    async function freshModuleWithMockedFs() {
      const fs = await import('node:fs')
      const mod = await import('../../../src/lib/tidecloakConfig')
      mod.__resetTideCloakConfigCache()
      return { mod, mockedReadFileSync: fs.readFileSync as unknown as ReturnType<typeof vi.fn> }
    }

    it('resolves the exported path constant to the repo root, not process.cwd()', async () => {
      const { mod } = await freshModuleWithMockedFs()
      expect(mod.REPO_ROOT_ADAPTER_PATH).toBe(EXPECTED_REPO_ROOT_ADAPTER_PATH)
    })

    it('reads from the repo-root path when the process cwd is the repository root', async () => {
      process.chdir(REPO_ROOT)
      const { mod, mockedReadFileSync } = await freshModuleWithMockedFs()
      const config = mod.loadTideCloakConfig()
      expect(mockedReadFileSync).toHaveBeenCalledWith(EXPECTED_REPO_ROOT_ADAPTER_PATH, 'utf-8')
      expect(config.resource).toBe('soc-incident-report-protection-app')
    })

    it('still reads from the repo-root path when the process cwd is backend/ (e.g. `pnpm --filter backend test`)', async () => {
      process.chdir(join(REPO_ROOT, 'backend'))
      const { mod, mockedReadFileSync } = await freshModuleWithMockedFs()
      const config = mod.loadTideCloakConfig()
      expect(mockedReadFileSync).toHaveBeenCalledWith(EXPECTED_REPO_ROOT_ADAPTER_PATH, 'utf-8')
      expect(config.resource).toBe('soc-incident-report-protection-app')
    })

    it('still reads from the repo-root path from an unrelated cwd', async () => {
      // Use a genuinely unrelated directory outside the repo (created via
      // os.tmpdir() / fs.mkdtempSync(), not the repo's gitignored data/
      // directory — that directory doesn't exist on a clean checkout, e.g. a
      // CI runner, so chdir-ing into it would throw ENOENT there even though
      // it exists on a machine that has already run local TideCloak setup).
      const tempCwd = mkdtempSync(join(tmpdir(), 'tidecloak-config-test-'))
      try {
        process.chdir(tempCwd)
        const { mod, mockedReadFileSync } = await freshModuleWithMockedFs()
        const config = mod.loadTideCloakConfig()
        expect(mockedReadFileSync).toHaveBeenCalledWith(EXPECTED_REPO_ROOT_ADAPTER_PATH, 'utf-8')
        expect(config.resource).toBe('soc-incident-report-protection-app')
      } finally {
        process.chdir(originalCwd)
        rmSync(tempCwd, { recursive: true, force: true })
      }
    })
  })
})
