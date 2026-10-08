import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'
import type { IncidentDetail } from '@/types/incident'

vi.mock('@/lib/api/access', () => ({
  accessApi: vi.fn().mockResolvedValue({ requests: [] }),
  AccessApiError: class extends Error {},
}))
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

  it('links each locked resource to its own allow-listed access request', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue(DETAIL)
    render(<IncidentDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Victim Host')).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: 'Request access to Victim Host' })).toHaveAttribute(
      'href',
      '/incidents/INC-1001/request-access?resource=victimHost'
    )
    expect(
      screen.getByRole('link', { name: 'Request access to Exposure Evidence' })
    ).toHaveAttribute('href', '/incidents/INC-1001/request-access?resource=exposureEvidence')
    expect(
      screen.getByRole('link', { name: 'Request access to Suspicious Process' })
    ).toHaveAttribute('href', '/incidents/INC-1001/request-access?resource=suspiciousProcess')
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
    // Resource keys are required in request-link URLs, but must never be
    // rendered as visible evidence content.
    expect(document.body.textContent).not.toContain('victimHost')
    expect(document.body.textContent).not.toContain('exposureEvidence')
    expect(document.body.textContent).not.toContain('suspiciousProcess')
  })

  it('renders locked labels and request links without protected value text', async () => {
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
      expect(row?.textContent).toContain(`${label}Locked`)
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
  it.each([
    {
      failure: 'not-found',
      error: () => new IncidentNotFoundError('INC-9999'),
      previousState: /incident not found/i,
    },
    {
      failure: 'API-error',
      error: () => new IncidentApiError('Incident service unavailable'),
      previousState: /something went wrong/i,
    },
  ])(
    'recovers from a $failure state when the incident ID changes without unmounting',
    async ({ error, previousState }) => {
      vi.mocked(useParams).mockReturnValue({ id: 'INC-9999' })
      vi.mocked(fetchIncidentById).mockRejectedValueOnce(error()).mockResolvedValueOnce(DETAIL)
      const { rerender } = render(<IncidentDetailPage />)

      await screen.findByText(previousState)
      vi.mocked(useParams).mockReturnValue({ id: DETAIL.id })
      rerender(<IncidentDetailPage />)

      await screen.findByRole('heading', { name: DETAIL.id })
      expect(fetchIncidentById).toHaveBeenLastCalledWith({ getToken }, DETAIL.id)
      expect(screen.queryByText(/incident not found/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
      expect(screen.getByText('Credential stuffing')).toBeInTheDocument()
      expect(screen.getAllByText('Locked')).toHaveLength(3)
      expect(screen.getByRole('link', { name: 'Request access to Victim Host' })).toHaveAttribute(
        'href',
        '/incidents/INC-1001/request-access?resource=victimHost'
      )
    }
  )

  it('replaces a previous not-found state with the current incident API error', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'INC-9999' })
    vi.mocked(fetchIncidentById)
      .mockRejectedValueOnce(new IncidentNotFoundError('INC-9999'))
      .mockRejectedValueOnce(new IncidentApiError('Current incident load failed'))
    const { rerender } = render(<IncidentDetailPage />)

    await screen.findByText(/incident not found/i)
    vi.mocked(useParams).mockReturnValue({ id: 'INC-1002' })
    rerender(<IncidentDetailPage />)

    await screen.findByText('Current incident load failed')
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByText(/incident not found/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: DETAIL.id })).not.toBeInTheDocument()
  })

  it.each(['success', 'not-found', 'API-error'] as const)(
    'ignores an older %s response after the current incident loads',
    async (outcome) => {
      let resolvePrevious: (value: IncidentDetail) => void = () => {}
      let rejectPrevious: (error: Error) => void = () => {}
      const previousResponse = new Promise<IncidentDetail>((resolve, reject) => {
        resolvePrevious = resolve
        rejectPrevious = reject
      })
      vi.mocked(useParams).mockReturnValue({ id: 'INC-1002' })
      vi.mocked(fetchIncidentById)
        .mockReturnValueOnce(previousResponse)
        .mockResolvedValueOnce(DETAIL)
      const { rerender } = render(<IncidentDetailPage />)

      vi.mocked(useParams).mockReturnValue({ id: DETAIL.id })
      rerender(<IncidentDetailPage />)
      await screen.findByRole('heading', { name: DETAIL.id })

      await act(async () => {
        if (outcome === 'success') {
          resolvePrevious({ ...DETAIL, id: 'INC-1002', threat: 'Previous incident threat' })
        } else if (outcome === 'not-found') {
          rejectPrevious(new IncidentNotFoundError('INC-1002'))
        } else {
          rejectPrevious(new IncidentApiError('Previous incident load failed'))
        }
      })

      expect(screen.getByRole('heading', { name: DETAIL.id })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'INC-1002' })).not.toBeInTheDocument()
      expect(screen.queryByText('Previous incident threat')).not.toBeInTheDocument()
      expect(screen.queryByText('Previous incident load failed')).not.toBeInTheDocument()
      expect(screen.queryByText(/incident not found/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument()
      expect(screen.getAllByText('Locked')).toHaveLength(3)
    }
  )
})
