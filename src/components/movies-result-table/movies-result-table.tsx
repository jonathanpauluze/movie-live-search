import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/table'
import { PosterImage } from '@/components/poster-image'
import styles from './movies-result-table.module.css'
import type { TMDBMovie } from '@/services/tmdb'
import type { Ref } from 'react'

type MoviesResultTableProps = {
  ref?: Ref<HTMLTableRowElement | null>
  movies: TMDBMovie[]
}

export function MoviesResultTable(props: Readonly<MoviesResultTableProps>) {
  const { ref, movies } = props

  return (
    <Table wrapperClassName={styles.wrapper}>
      <TableHeader>
        <TableRow>
          <TableHead>Poster</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Gêneros</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {movies.map((movie, index) => {
          const isLastMovie = index === movies.length - 1

          return (
            <TableRow key={movie.id} ref={isLastMovie ? ref : null}>
              <TableCell>
                <PosterImage path={movie.poster} />
              </TableCell>
              <TableCell className={styles.title}>{movie.title}</TableCell>
              <TableCell>{movie.release_year ?? '-'}</TableCell>
              <TableCell>
                {movie?.genres?.length > 0 ? movie.genres.join(', ') : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
