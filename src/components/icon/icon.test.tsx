import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Icon, type IconName } from '.'
import type { SVGProps } from 'react'

vi.mock('./icon-map', () => ({
  icons: {
    sun: (props: SVGProps<SVGSVGElement>) => (
      <svg data-testid="icon-sun" {...props} />
    ),
    moon: (props: SVGProps<SVGSVGElement>) => (
      <svg data-testid="icon-moon" {...props} />
    )
  }
}))

describe('Icon component', () => {
  it('renders the correct icon with default size', () => {
    render(<Icon name="sun" />)
    const icon = screen.getByTestId('icon-sun')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
  })

  it('renders with custom size sm', () => {
    render(<Icon name="moon" size="sm" />)
    const icon = screen.getByTestId('icon-moon')
    expect(icon).toHaveAttribute('width', '16')
    expect(icon).toHaveAttribute('height', '16')
  })

  it('renders with custom size lg', () => {
    render(<Icon name="sun" size="lg" />)
    const icon = screen.getByTestId('icon-sun')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('applies additional className', () => {
    render(<Icon name="moon" className="custom-class" />)
    const icon = screen.getByTestId('icon-moon')
    expect(icon).toHaveClass('icon')
    expect(icon).toHaveClass('custom-class')
  })

  it('returns null for unknown icon name', () => {
    render(<Icon name={'invalid' as IconName} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument()
  })
})
