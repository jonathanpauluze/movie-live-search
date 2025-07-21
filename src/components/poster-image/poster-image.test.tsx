import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PosterImage } from '.'

vi.mock('@/components/icon', () => ({
  Icon: ({ name }: { name: string }) => (
    <svg data-testid="icon" data-name={name} />
  )
}))

describe('PosterImage', () => {
  it('renders the image when path is provided', () => {
    render(<PosterImage path="/poster.jpg" alt="Filme Exemplo" />)

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w92/poster.jpg'
    )
    expect(image).toHaveAttribute('alt', 'Filme Exemplo')
  })

  it('renders the fallback icon when path is null', () => {
    render(<PosterImage path={null} alt="qualquer" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'movie')
  })

  it('uses empty alt by default when not provided', () => {
    render(<PosterImage path="/image.jpg" />)

    const image = screen.getByAltText('')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', '')
  })
})
