import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { highlightMatch } from '.'

describe('highlight-match utils', () => {
  it('returns full text when term is empty', () => {
    const result = highlightMatch('Uma busca', '')
    expect(result).toEqual(['Uma busca'])
  })

  it('returns full text when term is not found', () => {
    const result = highlightMatch('Outra busca', 'resultado')
    expect(result).toEqual(['Outra busca'])
  })

  it('returns parts with a highlighted match', () => {
    const result = highlightMatch('Demon Slayer: Castelo Infinito', 'Slayer')

    expect(result).toHaveLength(3)
    expect(result[0]).toBe('Demon ')
    expect(result[1]).toMatchObject({
      type: 'span',
      props: {
        children: 'Slayer',
        style: {
          color: 'var(--color-primary-heavy)',
          fontWeight: 500
        }
      }
    })
    expect(result[2]).toBe(': Castelo Infinito')
  })

  it('matches ignoring accents and case', () => {
    const result = highlightMatch('Um filmão brabo', 'FILMAO')

    expect(result[1]).toMatchObject({
      props: {
        children: 'filmão'
      }
    })
  })

  it('renders correctly when used in JSX', () => {
    const chunks = highlightMatch('Live Search', 'sea')
    const { container } = render(<p>{chunks}</p>)
    expect(container.textContent).toBe('Live Search')
    const span = container.querySelector('span')
    expect(span).toBeTruthy()
    expect(span?.textContent?.toLowerCase()).toBe('sea')
  })
})
