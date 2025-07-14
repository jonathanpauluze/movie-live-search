import { useState, useEffect, useRef } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { highlightMatch } from '@/utils/highlight-match'
import styles from './search-bar.module.css'

type Suggestion = {
  id: number
  title: string
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const debouncedTerm = useDebouncedValue(searchTerm, 300)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return

    if (event.key === 'ArrowRight') {
      const suggestion = suggestions[0]

      if (
        suggestion?.title?.toLowerCase().startsWith(searchTerm.toLowerCase())
      ) {
        event.preventDefault()
        setSearchTerm(suggestion.title)
        setSuggestions([])
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      const selected = suggestions[highlightedIndex]

      if (selected) {
        setSearchTerm(selected.title)
        setSuggestions([])
      }
    }

    if (event.key === 'Escape') {
      setSuggestions([])
    }
  }

  useEffect(() => {
    if (!debouncedTerm) {
      setSuggestions([])
      return
    }

    const mockResults = [
      { id: 1, title: 'The Matrix' },
      { id: 2, title: 'The Lord of the Rings' },
      { id: 3, title: 'The Social Network' },
      { id: 3, title: 'The Social Network 2' },
      { id: 3, title: 'The Social Network 3' },
      { id: 3, title: 'The Social Network 4' }
    ]

    const filtered = mockResults.filter((item) =>
      item.title.toLowerCase().includes(debouncedTerm.toLowerCase())
    )

    setSuggestions(filtered)
    setHighlightedIndex(0)
  }, [debouncedTerm])

  useEffect(() => {
    const highlightedElement = itemRefs.current[highlightedIndex]
    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [highlightedIndex])

  return (
    <div className={styles.wrapper}>
      <label htmlFor="search" className={styles.label}>
        Pesquise um filme
      </label>

      <input
        id="search"
        className={styles.input}
        type="text"
        placeholder="Ex: Star Wars"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      {suggestions.length > 0 && debouncedTerm && (
        <p className={styles.autocomplete}>
          {`${searchTerm}`} – Utilize a tecla → para aceitar a sugestão
        </p>
      )}

      <p className={styles.help}>
        Utilize as teclas ↓ ↑ para navegar entre as opções
      </p>

      {suggestions.length > 0 && (
        <ul className={styles.dropdown} ref={listRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              className={index === highlightedIndex ? styles.highlighted : ''}
            >
              {highlightMatch(suggestion.title, searchTerm)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
