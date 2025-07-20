import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoviesResultTable } from './movies-result-table'
import type { TMDBMovie } from '@/services/tmdb'

vi.mock('@/components/poster-image', () => ({
  PosterImage: ({ path }: { path: string }) => <img alt="poster" src={path} />
}))

const movies: TMDBMovie[] = [
  {
    id: 1,
    title: 'Interestelar',
    genres: ['Ficção científica'],
    poster: '/interestelar.jpg',
    release_year: 2014
  },
  {
    id: 2,
    title: 'Batman',
    genres: ['Ação'],
    poster: '/batman.jpg',
    release_year: 2005
  }
]

describe('MoviesResultTable component', () => {
  it('renders table with movie data', () => {
    render(<MoviesResultTable movies={movies} />)

    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Ano')).toBeInTheDocument()
    expect(screen.getByText('Gêneros')).toBeInTheDocument()

    expect(screen.getByText('Interestelar')).toBeInTheDocument()
    expect(screen.getByText('Batman')).toBeInTheDocument()

    expect(screen.getByText('Ficção científica')).toBeInTheDocument()
    expect(screen.getByText('Ação')).toBeInTheDocument()
    expect(screen.getByText('2014')).toBeInTheDocument()
    expect(screen.getByText('2005')).toBeInTheDocument()
  })

  it('shows "-" for missing release year or genres', () => {
    const incomplete: TMDBMovie[] = [
      {
        id: 3,
        title: 'Desconhecido',
        genres: [],
        poster: '/empty.jpg',
        release_year: null
      }
    ]

    render(<MoviesResultTable movies={incomplete} />)

    expect(screen.getByText('Desconhecido')).toBeInTheDocument()
    expect(screen.getAllByText('-')).toHaveLength(2)
  })

  it('assigns ref to the last movie row', () => {
    const lastRowRef = vi.fn()

    render(<MoviesResultTable movies={movies} ref={lastRowRef} />)

    expect(lastRowRef).not.toHaveBeenCalledWith(
      expect.objectContaining({
        textContent: expect.stringContaining('Interestelar')
      })
    )

    expect(lastRowRef).toHaveBeenCalled()
  })
})
