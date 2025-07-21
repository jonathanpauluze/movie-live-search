import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '.'
import styles from './modal.module.css'

vi.mock('@/components/icon', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />
}))

describe('Modal component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} title="Título">
        Conteúdo
      </Modal>
    )

    expect(screen.queryByText('Título')).not.toBeInTheDocument()
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders title and children when open', () => {
    render(
      <Modal isOpen={true} title="Título">
        Conteúdo
      </Modal>
    )

    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('calls onClose when clicking close button', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} title="Título" onClose={onClose}>
        Conteúdo
      </Modal>
    )

    const closeBtn = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeBtn)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside the modal', () => {
    const onClose = vi.fn()

    const { container } = render(
      <Modal isOpen={true} title="Teste Outside" onClose={onClose}>
        Conteúdo
      </Modal>
    )

    const overlay = container.querySelector(`.${styles.overlay}`)
    if (!overlay) throw new Error('Overlay not found')

    fireEvent.mouseDown(overlay)

    expect(onClose).toHaveBeenCalled()
  })
})
