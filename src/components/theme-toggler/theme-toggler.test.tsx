import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '.'

vi.mock('@/components/icon', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />
}))

const toggleThemeMock = vi.fn()

vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: toggleThemeMock
  })
}))

describe('ThemeToggler component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with light theme', () => {
    render(<ThemeToggle />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    expect(screen.getByTestId('icon-sun')).toBeInTheDocument()
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument()
  })

  it('renders with dark theme', async () => {
    vi.resetModules()

    vi.doMock('@/hooks/use-theme', () => ({
      useTheme: () => ({
        theme: 'dark',
        toggleTheme: toggleThemeMock
      })
    }))

    const { ThemeToggle } = await import('./theme-toggler')

    const { unmount } = render(<ThemeToggle />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()

    unmount()
  })

  it('toggles theme on click', () => {
    render(<ThemeToggle />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(toggleThemeMock).toHaveBeenCalledTimes(1)

    fireEvent.click(checkbox)

    expect(toggleThemeMock).toHaveBeenCalledTimes(2)
  })
})
