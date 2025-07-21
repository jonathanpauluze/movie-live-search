import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MovieSearchBar } from '.'
import { vi } from 'vitest'

const toggleMock = vi.fn()
const hasMock = vi.fn(() => false)

vi.mock('@/hooks/use-click-outside', () => ({
  useClickOutside: vi.fn()
}))

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: () => ({
    toggle: toggleMock,
    has: hasMock
  })
}))

function renderMovieSearchBar(search = '') {
  const handleChange = vi.fn()
  const handleSelect = vi.fn()

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

  const renderResult = render(
    <MovieSearchBar
      value={search}
      onChange={handleChange}
      onSelect={handleSelect}
      suggestions={suggestions}
    />
  )

  return {
    handleChange,
    handleSelect,
    suggestions,
    renderResult
  }
}

describe('MovieSearchBar component', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn()

    globalThis.IntersectionObserver = function () {
      return {
        observe: () => undefined,
        unobserve: () => undefined,
        disconnect: () => undefined,
        takeRecords: () => []
      }
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    cleanup()
  })

  it('renders input and suggestions', () => {
    renderMovieSearchBar()

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(screen.getByText('Pesquise um filme')).toBeInTheDocument()
  })

  it('shows autocomplete suggestion when typing matches', async () => {
    renderMovieSearchBar('Clube')

    expect(
      screen.getByText('da Luta - Utilize a tecla → para aceitar a sugestão')
    ).toBeInTheDocument()
  })

  it('navigates with ArrowDown and ArrowUp between suggestions', () => {
    const { handleSelect, suggestions } = renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(handleSelect).toHaveBeenCalledWith(suggestions[0])
  })

  it('calls toggle function when press Space in highlighted suggestion', () => {
    const { suggestions } = renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: ' ' })

    expect(toggleMock).toHaveBeenCalledWith(suggestions[0])
  })

  it('accepts suggestion with ArrowRight', () => {
    const { handleChange } = renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith('Clube da Luta')
  })

  it('return the old value with ArrowLeft', () => {
    const { handleChange } = renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith('Clube da Luta')

    fireEvent.keyDown(input, { key: 'ArrowLeft' })

    expect(handleChange).toHaveBeenCalledWith('Clube')
  })

  it('navigates with ArrowDown and selects with Enter', async () => {
    const { handleSelect, suggestions } = renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(handleSelect).toHaveBeenCalledWith(suggestions[0])
  })

  it('hides highlight and blurs on pressing Escape', () => {
    renderMovieSearchBar('Clube')

    const input = screen.getByRole('textbox')

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.getByText(/da Luta - Utilize a tecla →/)).toBeInTheDocument()

    const highlighted = screen.queryByRole('option', { selected: true })
    expect(highlighted).not.toBeInTheDocument()

    expect(input).toBeInTheDocument()
  })
})
