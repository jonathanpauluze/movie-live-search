import styles from './no-results-message.module.css'

type NoResultsMessageProps = {
  query: string
}

export function NoResultsMessage(props: Readonly<NoResultsMessageProps>) {
  const { query } = props

  const encodedQuery = encodeURIComponent(query.trim())

  return (
    <div className={styles.wrapper}>
      <p>
        Nenhum resultado encontrado para <strong>“{query}”</strong>.
      </p>

      <ul>
        <li>
          <a
            href={`https://www.imdb.com/find?q=${encodedQuery}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buscar “{query}” no IMDB
          </a>
        </li>
        <li>
          <a
            href={`https://www.google.com/search?q=${encodedQuery}+site:imdb.com`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buscar “{query}” no Google
          </a>
        </li>
      </ul>
    </div>
  )
}
