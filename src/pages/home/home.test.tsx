import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '.'
import type { TMDBMovie } from '@/services/tmdb'

const mockUseFavorites = vi.fn()

vi.mock('@/hooks/use-favorites', () => ({
  useFavorites: () => mockUseFavorites()
}))
vi.mock('@/hooks/use-search-movies', () => ({
  useSearchMovies: () => ({
    isLoading: false,
    isFetchingNextPage: false,
    results: [],
    fetchNextPage: vi.fn()
  })
}))

vi.mock('@/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => ({ current: null })
}))

vi.mock('@/utils/open-imdb-page', () => ({
  openIMDBPage: vi.fn()
}))

vi.mock('@/components/movies-result-table', () => ({
  MoviesResultTable: () => <div data-testid="result-table" />
}))

vi.mock('@/components/movies-favorites-table', () => ({
  MoviesFavoritesTable: ({ movies }: { movies: TMDBMovie[] }) => (
    <div data-testid="favorites-table">
      {movies.map((movie) => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          <div>{movie.release_year}</div>
          <div>{movie.genres.join(', ')}</div>
        </div>
      ))}
    </div>
  )
}))

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders favorites section when no search term', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      remove: vi.fn()
    })

    render(<Home />)

    expect(screen.getByText(/Meus Favoritos/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Nenhum filme favoritado ainda/i)
    ).toBeInTheDocument()
  })

  it('renders favorites table if has favorites', () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        {
          id: 1,
          title: 'Interestelar',
          genres: ['Ficção científica'],
          poster: '/interestelar.jpg',
          release_year: 2014
        }
      ],
      remove: vi.fn()
    })

    render(<Home />)

    expect(screen.getByTestId('favorites-table')).toBeInTheDocument()
    expect(screen.getByText('Interestelar')).toBeInTheDocument()
    expect(screen.getByText('Ficção científica')).toBeInTheDocument()
    expect(screen.getByText('2014')).toBeInTheDocument()
  })
})
