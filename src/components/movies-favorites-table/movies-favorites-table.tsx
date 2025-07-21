import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/table'
import { PosterImage } from '@/components/poster-image'
import { Icon } from '@/components/icon'
import styles from './movies-favorites-table.module.css'
import type { TMDBMovie } from '@/services/tmdb'

type MoviesFavoritesTableProps = {
  movies: TMDBMovie[]
  onRemove?: (movie: TMDBMovie) => void
}

export function MoviesFavoritesTable(
  props: Readonly<MoviesFavoritesTableProps>
) {
  const { movies, onRemove } = props

  return (
    <Table wrapperClassName={styles.wrapper}>
      <TableHeader>
        <TableRow>
          <TableHead>Poster</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Gêneros</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {movies.map((movie) => (
          <TableRow key={movie.id}>
            <TableCell>
              <PosterImage path={movie.poster} />
            </TableCell>
            <TableCell className={styles.title}>{movie.title}</TableCell>
            <TableCell>{movie.release_year ?? '-'}</TableCell>
            <TableCell className={styles.genres}>
              {movie?.genres?.length > 0 ? movie.genres.join(', ') : '-'}
            </TableCell>
            <TableCell>
              <button
                className={styles.removeBtn}
                onClick={() => onRemove?.(movie)}
              >
                <Icon name="trash" size="sm" />
                Remover
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
