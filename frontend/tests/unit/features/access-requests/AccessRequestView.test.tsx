import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AccessRequestView } from '@/features/access-requests/components/AccessRequestView'
import type { AuthContextValue } from '@/types/auth'
import type { IncidentDetail } from '@/types/incident'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
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
import { fetchIncidentById, IncidentApiError, IncidentNotFoundError } from '@/lib/api/incidents'

const getToken = vi.fn()

const INCIDENT: IncidentDetail = {
  id: 'INC-1001',
  threat: 'Credential stuffing',
  severity: 'high',
  status: 'investigating',
  timeline: [{ at: '2026-09-20T10:00:00Z', event: 'Alert triggered' }],
  indicators: ['198.51.100.23', 'login-anomaly'],
  lockedFields: ['victimHost', 'exposureEvidence', 'suspiciousProcess'],
}

const SECOND_INCIDENT: IncidentDetail = {
  ...INCIDENT,
  id: 'INC-2002',
  threat: 'Malware execution',
}

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

function renderRequest(resourceQuery: string | null = 'victimHost') {
  return render(<AccessRequestView incidentId="INC-1001" resourceQuery={resourceQuery} />)
}

async function loadForm(resourceQuery: string | null = 'victimHost') {
  vi.mocked(fetchIncidentById).mockResolvedValue(INCIDENT)
  renderRequest(resourceQuery)
  await screen.findByRole('heading', { name: 'Emergency access request' })
}

async function enterValidReason(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole('textbox', { name: 'Reason' }),
    'Temporary access is needed to complete incident triage.'
  )
}

async function submitValidRequest(
  user: ReturnType<typeof userEvent.setup>,
  reason = 'Temporary access is needed to complete incident triage.'
) {
  fireEvent.change(screen.getByRole('textbox', { name: 'Reason' }), {
    target: { value: reason },
  })
  await user.click(screen.getByRole('radio', { name: '30 minutes' }))
  await user.click(
    screen.getByRole('checkbox', { name: /I understand that access requires approval/i })
  )
  await user.click(screen.getByRole('button', { name: 'Prepare request' }))
}

describe('AccessRequestView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth()
  })

  it('shows authentication loading without fetching incident data', () => {
    mockAuth({ authenticated: false, loading: true, user: null })
    renderRequest()

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    expect(fetchIncidentById).not.toHaveBeenCalled()
  })

  it('shows incident loading while the safe GET request is pending', () => {
    vi.mocked(fetchIncidentById).mockReturnValue(new Promise(() => {}))
    renderRequest()

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('shows safe incident and selected resource information without rendering resource keys', async () => {
    await loadForm()

    expect(screen.getByText('INC-1001')).toBeInTheDocument()
    expect(screen.getByText('Credential stuffing')).toBeInTheDocument()
    expect(screen.getByText('Victim Host')).toBeInTheDocument()
    expect(screen.getByText('Read-only')).toBeInTheDocument()
    expect(document.body.innerHTML).not.toContain('victimHost')
    expect(document.body.innerHTML).not.toContain('exposureEvidence')
    expect(document.body.innerHTML).not.toContain('suspiciousProcess')
  })

  it.each([
    [null, /choose a protected resource/i],
    ['not-allow-listed', /not recognised/i],
  ])('fails safely for an invalid resource query', (resourceQuery, message) => {
    renderRequest(resourceQuery)

    expect(screen.getByText('Access request unavailable')).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(fetchIncidentById).not.toHaveBeenCalled()
  })

  it('fails safely when the resource is not locked for the incident', async () => {
    vi.mocked(fetchIncidentById).mockResolvedValue({
      ...INCIDENT,
      lockedFields: ['exposureEvidence', 'suspiciousProcess'],
    })
    renderRequest()

    await screen.findByText('Access request unavailable')
    expect(screen.getByText(/not listed as protected/i)).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('shows an unknown incident state', async () => {
    vi.mocked(fetchIncidentById).mockRejectedValue(new IncidentNotFoundError('INC-1001'))
    renderRequest()

    await screen.findByText('Incident not found')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('shows an API error and retries the incident GET request', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchIncidentById)
      .mockRejectedValueOnce(new IncidentApiError('Unable to load incident'))
      .mockResolvedValueOnce(INCIDENT)
    renderRequest()

    await screen.findByText('Unable to load incident')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    await screen.findByRole('heading', { name: 'Emergency access request' })
    expect(fetchIncidentById).toHaveBeenCalledTimes(2)
  })

  it('rejects a reason shorter than 20 characters', async () => {
    const user = userEvent.setup()
    await loadForm()

    await user.type(screen.getByRole('textbox', { name: 'Reason' }), 'Too short')
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    expect(await screen.findByText('Reason must be at least 20 characters.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Request prepared' })).not.toBeInTheDocument()
  })

  it('rejects a reason longer than 500 characters', async () => {
    const user = userEvent.setup()
    await loadForm()

    fireEvent.change(screen.getByRole('textbox', { name: 'Reason' }), {
      target: { value: 'a'.repeat(501) },
    })
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    expect(await screen.findByText('Reason must be 500 characters or fewer.')).toBeInTheDocument()
    expect(screen.getByText('501/500 characters')).toBeInTheDocument()
  })

  it('accepts exactly 20 trimmed characters and removes surrounding whitespace', async () => {
    const user = userEvent.setup()
    await loadForm()

    await submitValidRequest(user, '   12345678901234567890   ')

    expect(await screen.findByRole('heading', { name: 'Request prepared' })).toBeInTheDocument()
    expect(screen.getByText('12345678901234567890')).toBeInTheDocument()
  })

  it('accepts exactly 500 trimmed characters', async () => {
    const user = userEvent.setup()
    const reason = 'a'.repeat(500)
    await loadForm()

    await submitValidRequest(user, reason)

    expect(await screen.findByRole('heading', { name: 'Request prepared' })).toBeInTheDocument()
    expect(screen.getByText(reason)).toBeInTheDocument()
  })

  it('trims surrounding whitespace before enforcing the minimum reason length', async () => {
    const user = userEvent.setup()
    await loadForm()

    await submitValidRequest(user, `   ${'a'.repeat(19)}   `)

    expect(await screen.findByText('Reason must be at least 20 characters.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Request prepared' })).not.toBeInTheDocument()
  })

  it('requires a requested duration', async () => {
    const user = userEvent.setup()
    await loadForm()

    await enterValidReason(user)
    await user.click(
      screen.getByRole('checkbox', { name: /I understand that access requires approval/i })
    )
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    expect(await screen.findByText('Select a requested duration.')).toBeInTheDocument()
  })

  it('requires the approval and demonstration acknowledgment', async () => {
    const user = userEvent.setup()
    await loadForm()

    await enterValidReason(user)
    await user.click(screen.getByRole('radio', { name: '30 minutes' }))
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    expect(
      await screen.findByText('You must acknowledge the approval and demonstration requirements.')
    ).toBeInTheDocument()
  })

  it('prepares a local-only summary and performs no backend mutation', async () => {
    const user = userEvent.setup()
    await loadForm()

    await user.type(
      screen.getByRole('textbox', { name: 'Reason' }),
      '   Temporary access is needed to complete incident triage.   '
    )
    await user.click(screen.getByRole('radio', { name: '30 minutes' }))
    await user.click(
      screen.getByRole('checkbox', { name: /I understand that access requires approval/i })
    )
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    expect(await screen.findByRole('heading', { name: 'Request prepared' })).toBeInTheDocument()
    expect(
      screen.getByText('Demo only — this request was not submitted, saved or approved.')
    ).toBeInTheDocument()
    expect(screen.getByText('Victim Host')).toBeInTheDocument()
    expect(screen.getByText('Read-only')).toBeInTheDocument()
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
    expect(
      screen.getByText('Temporary access is needed to complete incident triage.')
    ).toBeInTheDocument()
    expect(screen.getByText('Two other SOC staff members')).toBeInTheDocument()
    expect(fetchIncidentById).toHaveBeenCalledTimes(1)
  })

  it('clears a prepared request when the resource changes and does not restore it later', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchIncidentById).mockResolvedValue(INCIDENT)
    const { rerender } = renderRequest()
    await screen.findByRole('heading', { name: 'Emergency access request' })
    await submitValidRequest(user)
    expect(await screen.findByRole('heading', { name: 'Request prepared' })).toBeInTheDocument()

    rerender(<AccessRequestView incidentId="INC-1001" resourceQuery="exposureEvidence" />)

    expect(screen.queryByRole('heading', { name: 'Request prepared' })).not.toBeInTheDocument()
    expect(await screen.findByText('Exposure Evidence')).toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'Prepare emergency access request' })
    ).toBeInTheDocument()

    rerender(<AccessRequestView incidentId="INC-1001" resourceQuery="victimHost" />)

    expect(await screen.findByText('Victim Host')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Request prepared' })).not.toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'Prepare emergency access request' })
    ).toBeInTheDocument()
  })

  it('clears a prepared request when the incident changes while mounted', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchIncidentById)
      .mockResolvedValueOnce(INCIDENT)
      .mockResolvedValueOnce(SECOND_INCIDENT)
    const { rerender } = renderRequest()
    await screen.findByRole('heading', { name: 'Emergency access request' })
    await submitValidRequest(user)
    expect(await screen.findByRole('heading', { name: 'Request prepared' })).toBeInTheDocument()

    rerender(<AccessRequestView incidentId="INC-2002" resourceQuery="victimHost" />)

    expect(screen.queryByRole('heading', { name: 'Request prepared' })).not.toBeInTheDocument()
    expect(await screen.findByText('INC-2002')).toBeInTheDocument()
    expect(screen.getByText('Malware execution')).toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'Prepare emergency access request' })
    ).toBeInTheDocument()
  })

  it('supports keyboard focus and associates validation errors with their controls', async () => {
    const user = userEvent.setup()
    await loadForm()

    const reason = screen.getByRole('textbox', { name: 'Reason' })
    const firstDuration = screen.getByRole('radio', { name: '15 minutes' })
    const acknowledgment = screen.getByRole('checkbox', {
      name: /I understand that access requires approval/i,
    })

    await user.tab()
    expect(reason).toHaveFocus()
    await user.tab()
    expect(firstDuration).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    await screen.findByText('Reason must be at least 20 characters.')
    expect(reason).toHaveAttribute('aria-describedby', 'reason-help reason-error')
    expect(document.getElementById('reason-error')).toHaveTextContent(
      'Reason must be at least 20 characters.'
    )
    expect(firstDuration.closest('fieldset')).toHaveAttribute('aria-describedby', 'duration-error')
    expect(acknowledgment).toHaveAttribute('aria-describedby', 'acknowledgment-error')
  })

  it('links Cancel and Return to incident to the selected incident', async () => {
    const user = userEvent.setup()
    await loadForm()

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/incidents/INC-1001'
    )

    await enterValidReason(user)
    await user.click(screen.getByRole('radio', { name: '15 minutes' }))
    await user.click(
      screen.getByRole('checkbox', { name: /I understand that access requires approval/i })
    )
    await user.click(screen.getByRole('button', { name: 'Prepare request' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Return to incident' })).toHaveAttribute(
        'href',
        '/incidents/INC-1001'
      )
    })
  })
})
