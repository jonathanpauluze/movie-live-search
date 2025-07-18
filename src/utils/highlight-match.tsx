import { normalizeText } from '@/utils/normalize-text'
import type { JSX } from 'react'

export function highlightMatch(
  text: string,
  term: string
): (string | JSX.Element)[] {
  if (!term) return [text]

  const normalizedText = normalizeText(text)
  const normalizedTerm = normalizeText(term)

  const index = normalizedText.indexOf(normalizedTerm)

  if (index === -1) return [text]

  const start = text.slice(0, index)
  const match = text.slice(index, index + term.length)
  const end = text.slice(index + term.length)

  return [
    start,
    <span
      key="match"
      style={{ color: 'var(--color-primary-heavy)', fontWeight: 500 }}
    >
      {match}
    </span>,
    end
  ]
}
