import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'
import type { IncidentDetail } from '@/types/incident'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('next/navigation', () => ({ useParams: vi.fn() }))
vi.mock('@/lib/api/incidents', () => {
  class IncidentApiError extends Error {}
  class IncidentNotFoundError extends Error {}
  return {
    fetchIncidentById: vi.fn(),
    IncidentApiError,
    IncidentNotFoundError,
  }
})

import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import { fetchIncidentById, IncidentApiError, IncidentNotFoundError } from '@/lib/api/incidents'
import IncidentDetailPage from '@/app/(dashboard)/incidents/[id]/page'

const getToken = vi.fn()

function mockAuth(value: Partial<AuthContextValue> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: { uid: 'u1', username: 'alice', email: null, roles: ['soc-manager'] },
    authenticated: true,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    getToken,
    ...value,
  })
}

const DETAIL: IncidentDetail = {
  id: 'INC-1001',
  threat: 'Credential stuffing',
  severity: 'high',
  status: 'investigating',
  timeline: [{ at: '2026-09-20T10:00:00Z', event: 'Alert triggered' }],
  indicators: ['198.51.100.23', 'login-anomaly'],
  lockedFields: ['victimHost', 'exposureEvidence', 'suspiciousProcess'],
}

/** Known synthetic protected values that must never render, even indirectly. */
const KNOWN_PROTECTED_SUBSTRINGS = ['REDACTED-SYNTHETIC-HOST', 'protectedValue']

describe('IncidentDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth()
    vi.mocked(useParams).mockReturnValue({ id: 'INC-1001' })
  })

  it('shows a loading state before the incident resolves', () => {
    vi.mocked(fetchIncidentById).mockReturnValue(new Promise(() => {}))
    render(<IncidentDetailPage />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('renders general incident information, timeline and IoCs', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue(DETAIL)
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'INC-1001' })).toBeInTheDocument()
    })
    expect(screen.getByText('Credential stuffing')).toBeInTheDocument()
    expect(screen.getByText('198.51.100.23')).toBeInTheDocument()
    expect(screen.getByText('Alert triggered')).toBeInTheDocument()
  })

  it('renders locked indicators for Victim Host, Exposure Evidence and Suspicious Process', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue(DETAIL)
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Victim Host')).toBeInTheDocument()
    })
    expect(screen.getByText('Exposure Evidence')).toBeInTheDocument()
    expect(screen.getByText('Suspicious Process')).toBeInTheDocument()
    expect(screen.getAllByText(/locked/i).length).toBeGreaterThanOrEqual(3)
  })

  it('never renders any known protected synthetic value', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue(DETAIL)
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'INC-1001' })).toBeInTheDocument()
    })

    for (const value of KNOWN_PROTECTED_SUBSTRINGS) {
      expect(screen.queryByText(value)).not.toBeInTheDocument()
    }
    // The DOM must not contain the raw field key either, only the display label.
    expect(document.body.innerHTML.includes('victimHost')).toBe(false)
    expect(document.body.innerHTML.includes('exposureEvidence')).toBe(false)
    expect(document.body.innerHTML.includes('suspiciousProcess')).toBe(false)
  })

  it('renders locked labels only — no protected value text anywhere near the lock indicators', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue(DETAIL)
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Victim Host')).toBeInTheDocument()
    })

    const lockedLabels = ['Victim Host', 'Exposure Evidence', 'Suspicious Process']
    for (const label of lockedLabels) {
      const labelNode = screen.getByText(label)
      const row = labelNode.closest('div')
      expect(row).not.toBeNull()
      // The only other text in a locked-field row is the "Locked" status —
      // never a value.
      expect(row?.textContent).toMatch(new RegExp(`^${label}Locked$`))
    }
  })

  it('shows a not-found state for an unknown incident id', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'INC-9999' })
    vi.mocked(fetchIncidentById).mockRejectedValue(new IncidentNotFoundError('INC-9999'))
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByText(/incident not found/i)).toBeInTheDocument()
    })
  })

  it('shows an API error state when the fetch fails for a reason other than not-found', async () => {
    vi.mocked(fetchIncidentById).mockRejectedValue(new IncidentApiError('boom'))
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })
})
