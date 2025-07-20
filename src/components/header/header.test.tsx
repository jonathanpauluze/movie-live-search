import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '.'

vi.mock('@/components/theme-toggler', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />
}))

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)

    expect(screen.getByText('PlanneMovie DB')).toBeInTheDocument()
  })

  it('renders the theme toggle', () => {
    render(<Header />)

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })
})
