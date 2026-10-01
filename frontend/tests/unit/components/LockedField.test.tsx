import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LockedField } from '@/components/incidents/LockedField'

describe('LockedField', () => {
  it('renders the given label and a locked indicator', () => {
    render(<LockedField label="Victim Host" />)

    expect(screen.getByText('Victim Host')).toBeInTheDocument()
    expect(screen.getByText(/locked/i)).toBeInTheDocument()
  })

  it('renders an optional request link without accepting a protected value', () => {
    render(
      <LockedField
        label="Victim Host"
        requestHref="/incidents/INC-1001/request-access?resource=victimHost"
      />
    )

    expect(screen.getByRole('link', { name: 'Request access to Victim Host' })).toHaveAttribute(
      'href',
      '/incidents/INC-1001/request-access?resource=victimHost'
    )
  })

  it('has no prop through which a protected value could be passed', () => {
    // @ts-expect-error — LockedField's props intentionally have no value field.
    render(<LockedField label="Exposure Evidence" value="should not compile" />)
    expect(screen.getByText('Exposure Evidence')).toBeInTheDocument()
  })
})
