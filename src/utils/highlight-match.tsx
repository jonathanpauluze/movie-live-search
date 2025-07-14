import type { JSX } from 'react'

export function highlightMatch(
  text: string,
  term: string
): (string | JSX.Element)[] {
  if (!term) return [text]

  const regex = new RegExp(`(${term})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span
        key={index}
        style={{ color: 'var(--color-primary-icon)', fontWeight: 500 }}
      >
        {part}
      </span>
    ) : (
      part
    )
  )
}
