import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'
import type { IncidentSummary } from '@/types/incident'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('@/lib/api/incidents', () => ({
  fetchIncidents: vi.fn(),
  IncidentApiError: class IncidentApiError extends Error {},
}))

import { useAuth } from '@/hooks/useAuth'
import { fetchIncidents, IncidentApiError } from '@/lib/api/incidents'
import DashboardPage from '@/app/(dashboard)/dashboard/page'

const getToken = vi.fn()

function mockAuth(value: Partial<AuthContextValue> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: { uid: 'u1', username: 'alice', email: null, roles: ['soc-analyst'] },
    authenticated: true,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    getToken,
    ...value,
  })
}

const SUMMARY: IncidentSummary = {
  id: 'INC-1001',
  threat: 'Credential stuffing',
  severity: 'high',
  status: 'investigating',
  indicators: ['198.51.100.23', 'login-anomaly'],
  lockedFields: ['victimHost', 'exposureEvidence', 'suspiciousProcess'],
}

/** Known synthetic protected values that must never render, even indirectly. */
const KNOWN_PROTECTED_SUBSTRINGS = ['REDACTED-SYNTHETIC-HOST', 'victimHost value', 'protectedValue']

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth()
  })

  it('shows a loading state before incidents resolve', () => {
    vi.mocked(fetchIncidents).mockReturnValue(new Promise(() => {})) // never resolves
    render(<DashboardPage />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('renders incident rows once data loads', async () => {
    vi.mocked(fetchIncidents).mockResolvedValue([SUMMARY])
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('INC-1001')).toBeInTheDocument()
    })
    expect(screen.getByText('Credential stuffing')).toBeInTheDocument()
    expect(screen.getByText(/high/i)).toBeInTheDocument()
    expect(screen.getByText(/investigating/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'INC-1001' })).toHaveAttribute(
      'href',
      '/incidents/INC-1001'
    )
  })

  it('shows an empty state when there are no incidents', async () => {
    vi.mocked(fetchIncidents).mockResolvedValue([])
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('No incidents')).toBeInTheDocument()
    })
  })

  it('shows an API error state when the fetch fails', async () => {
    vi.mocked(fetchIncidents).mockRejectedValue(new IncidentApiError('boom'))
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
    expect(screen.queryByText('INC-1001')).not.toBeInTheDocument()
  })

  it('never renders any known protected synthetic value', async () => {
    vi.mocked(fetchIncidents).mockResolvedValue([SUMMARY])
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('INC-1001')).toBeInTheDocument()
    })

    for (const value of KNOWN_PROTECTED_SUBSTRINGS) {
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    }
  })
})
