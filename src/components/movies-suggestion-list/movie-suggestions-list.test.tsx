import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieSuggestionsList } from '.'

const toggleMock = vi.fn()
const hasMock = vi.fn()

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: () => ({
    toggle: toggleMock,
    has: hasMock
  })
}))

vi.mock('@/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => ({ current: null })
}))

const suggestions = [
  {
    id: 1,
    title: 'Star Wars',
    poster: '/poster.jpg',
    genres: ['Ação', 'Ficção'],
    release_year: 1977
  },
  {
    id: 2,
    title: 'Matrix',
    poster: '/matrix.jpg',
    genres: ['Ação'],
    release_year: 1999
  }
]

describe('MovieSuggestionsList component', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all movies in the list', () => {
    render(
      <MovieSuggestionsList
        suggestions={suggestions}
        exactMatch={suggestions[0]}
        value="Star"
        highlightedIndex={null}
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByText(/Star Wars/)).toBeInTheDocument()
    expect(screen.getByText(/Matrix/)).toBeInTheDocument()
  })

  it('calls onSelect when a suggestion is clicked', () => {
    const onSelect = vi.fn()

    render(
      <MovieSuggestionsList
        suggestions={suggestions}
        exactMatch={undefined}
        value="Matrix"
        highlightedIndex={null}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByText('Matrix'))
    expect(onSelect).toHaveBeenCalledWith(suggestions[1])
  })

  it('calls toggle when favorite button is clicked', () => {
    hasMock.mockReturnValue(false)

    render(
      <MovieSuggestionsList
        suggestions={suggestions}
        exactMatch={undefined}
        value=""
        highlightedIndex={null}
        onSelect={vi.fn()}
      />
    )

    const buttons = screen.getAllByRole('button', {
      name: /Adicionar aos favoritos/i
    })
    fireEvent.click(buttons[0])
    expect(toggleMock).toHaveBeenCalledWith(suggestions[0])
  })

  it('renders detailed information for the exact match suggestion', () => {
    render(
      <MovieSuggestionsList
        suggestions={suggestions}
        exactMatch={suggestions[0]}
        value="Star"
        highlightedIndex={null}
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByText(/Star Wars/).tagName).toBe('STRONG')
    expect(screen.getByText('(1977)')).toBeInTheDocument()
    expect(screen.getByText('Ação')).toBeInTheDocument()
    expect(screen.getByText('Ficção')).toBeInTheDocument()
  })

  it('applies the highlighted class correctly', () => {
    render(
      <MovieSuggestionsList
        suggestions={suggestions}
        exactMatch={undefined}
        value=""
        highlightedIndex={1}
        onSelect={vi.fn()}
      />
    )

    const items = screen.getAllByRole('listitem')
    expect(items[1].className).toMatch(/highlighted/)
  })
})
