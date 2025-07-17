import { Icon } from '../icon'
import styles from './poster-image.module.css'

type PosterImageProps = {
  path: string | null
  alt?: string
}

export function PosterImage(props: Readonly<PosterImageProps>) {
  const { path, alt = '' } = props

  if (!path)
    return (
      <div className={styles.defaultPoster}>
        <Icon name="movie" size="md" />
      </div>
    )
  return (
    <img
      src={`https://image.tmdb.org/t/p/w92${path}`}
      alt={alt}
      className={styles.poster}
    />
  )
}
