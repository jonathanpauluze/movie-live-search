import { describe, it, expect } from 'vitest'
import { normalizeText } from './normalize-text'

describe('normalize-text utils', () => {
  it('removes accents from characters', () => {
    expect(normalizeText('ação')).toBe('acao')
    expect(normalizeText('café')).toBe('cafe')
    expect(normalizeText('música')).toBe('musica')
  })

  it('converts to lowercase', () => {
    expect(normalizeText('CONTRATAÇÃO')).toBe('contratacao')
    expect(normalizeText('TeStE')).toBe('teste')
  })

  it('returns the same string if no accents and already lowercase', () => {
    expect(normalizeText('planne')).toBe('planne')
  })

  it('works with empty strings', () => {
    expect(normalizeText('')).toBe('')
  })

  it('removes combined diacritics and preserves base letters', () => {
    expect(normalizeText('São João de Meriti')).toBe('sao joao de meriti')
    expect(normalizeText('àéîõü')).toBe('aeiou')
  })
})
