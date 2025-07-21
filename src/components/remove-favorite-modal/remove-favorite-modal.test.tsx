import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RemoveFavoriteModal } from '.'

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

describe('RemoveFavoriteModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <RemoveFavoriteModal isOpen={false} movieTitle="Matrix" />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the modal title and message with the movie title', () => {
    render(<RemoveFavoriteModal isOpen={true} movieTitle="Matrix" />)

    expect(
      screen.getByRole('heading', { name: 'Remover favorito' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Tem certeza que deseja remover o filme/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent ===
          'Tem certeza que deseja remover o filme "Matrix" dos seus favoritos?'
      )
    ).toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn()

    render(
      <RemoveFavoriteModal
        isOpen={true}
        movieTitle="Matrix"
        onClose={onClose}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm when remove button is clicked', () => {
    const onConfirm = vi.fn()

    render(
      <RemoveFavoriteModal
        isOpen={true}
        movieTitle="Matrix"
        onConfirm={onConfirm}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(onConfirm).toHaveBeenCalled()
  })
})
