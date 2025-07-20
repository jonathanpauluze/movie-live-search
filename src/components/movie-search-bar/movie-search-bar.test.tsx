import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MovieSearchBar } from '.'
import { vi } from 'vitest'

vi.mock('@/hooks/use-click-outside', () => ({
  useClickOutside: vi.fn()
}))

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: () => ({
    toggle: vi.fn()
  })
}))

const suggestions = [
  {
    id: 123,
    title: 'Clube da Luta',
    genres: ['Ação'],
    poster: '/poster.jpg',
    release_year: 1999
  },
  {
    id: 124,
    title: 'Clube da Luta 2: Mais luta ainda',
    genres: ['Ação'],
    poster: '/poster.jpg',
    release_year: 2025
  }
]

describe('MovieSearchBar component', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders input and suggestions', () => {
    const handleChange = vi.fn()
    const handleSelect = vi.fn()

    render(
      <MovieSearchBar
        value=""
        onChange={handleChange}
        onSelect={handleSelect}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(screen.getByText('Pesquise um filme')).toBeInTheDocument()
  })

  it('shows autocomplete suggestion when typing matches', async () => {
    screen.debug()

    const handleChange = vi.fn()
    const handleSelect = vi.fn()

    render(
      <MovieSearchBar
        value="Clube"
        onChange={handleChange}
        onSelect={handleSelect}
        suggestions={suggestions}
      />
    )

    expect(
      screen.getByText('da Luta - Utilize a tecla → para aceitar a sugestão')
    ).toBeInTheDocument()
  })

  it('accepts suggestion with ArrowRight', () => {
    const handleChange = vi.fn()
    const handleSelect = vi.fn()

    render(
      <MovieSearchBar
        value="Clube"
        onChange={handleChange}
        onSelect={handleSelect}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith('Clube da Luta')
  })

  it('navigates with ArrowDown and selects with Enter', async () => {
    const handleChange = vi.fn()
    const handleSelect = vi.fn()

    render(
      <MovieSearchBar
        value="Star"
        onChange={handleChange}
        onSelect={handleSelect}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(handleSelect).toHaveBeenCalledWith(suggestions[0])
  })
})
