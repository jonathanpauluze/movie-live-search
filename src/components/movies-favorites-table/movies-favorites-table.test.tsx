import { render, screen, fireEvent } from '@testing-library/react'
import { MoviesFavoritesTable } from '.'
import type { TMDBMovie } from '@/services/tmdb'

vi.mock('@/components/poster-image', () => ({
  PosterImage: () => <img alt="poster" />
}))

vi.mock('@/components/icon', () => ({
  Icon: () => <svg data-testid="icon" />
}))

const movies: TMDBMovie[] = [
  {
    id: 1,
    title: 'O Poderoso Chefão',
    genres: ['Drama', 'Crime'],
    poster: '/godfather.jpg',
    release_year: 1972
  },
  {
    id: 2,
    title: 'Matrix',
    genres: ['Ficção científica'],
    poster: '/matrix.jpg',
    release_year: 1999
  }
]

describe('MoviesFavoritesTable component', () => {
  it('renders table with movie data', () => {
    render(<MoviesFavoritesTable movies={movies} />)

    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Ano')).toBeInTheDocument()
    expect(screen.getByText('Gêneros')).toBeInTheDocument()

    expect(screen.getByText('O Poderoso Chefão')).toBeInTheDocument()
    expect(screen.getByText('Matrix')).toBeInTheDocument()

    expect(screen.getByText('Drama, Crime')).toBeInTheDocument()
    expect(screen.getByText('1972')).toBeInTheDocument()
    expect(screen.getByText('Ficção científica')).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<MoviesFavoritesTable movies={movies} onRemove={onRemove} />)

    const removeButtons = screen.getAllByRole('button', { name: /remover/i })
    expect(removeButtons).toHaveLength(2)

    fireEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith(movies[0])

    fireEvent.click(removeButtons[1])
    expect(onRemove).toHaveBeenCalledWith(movies[1])
  })

  it('shows "-" for missing release year or genres', () => {
    const incompleteMovies: TMDBMovie[] = [
      {
        id: 3,
        title: 'Sem Ano e Gênero',
        genres: [],
        poster: '/none.jpg',
        release_year: null
      }
    ]

    render(<MoviesFavoritesTable movies={incompleteMovies} />)

    expect(screen.getByText('Sem Ano e Gênero')).toBeInTheDocument()
    expect(screen.getAllByText('-')).toHaveLength(2)
  })
})
