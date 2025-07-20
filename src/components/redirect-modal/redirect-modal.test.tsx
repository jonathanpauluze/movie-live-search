import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RedirectModal } from '.'

vi.mock('@/components/modal', () => ({
  Modal: ({
    isOpen,
    title,
    onClose,
    children
  }: {
    isOpen: boolean
    title: string
    onClose?: () => void
    children: React.ReactNode
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
}))

describe('RedirectModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<RedirectModal isOpen={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders modal title and message when isOpen is true', () => {
    render(<RedirectModal isOpen={true} />)

    expect(
      screen.getByRole('heading', { name: 'Redirecionando...' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Redirecionando para o site do IMDB...')
    ).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()

    render(<RedirectModal isOpen={true} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    closeButton.click()

    expect(onClose).toHaveBeenCalled()
  })
})
