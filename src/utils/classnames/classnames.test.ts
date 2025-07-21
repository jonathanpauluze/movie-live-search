import { describe, it, expect } from 'vitest'
import { classnames } from './classnames'

describe('classnames utils', () => {
  it('returns a single class when given a string', () => {
    expect(classnames('btn')).toBe('btn')
  })

  it('joins multiple strings with space', () => {
    expect(classnames('btn', 'primary')).toBe('btn primary')
  })

  it('filters falsy values', () => {
    expect(classnames('btn', undefined, null, false, 'active')).toBe(
      'btn active'
    )
  })

  it('adds class names from object when value is true', () => {
    expect(classnames({ btn: true, active: true, hidden: false })).toBe(
      'btn active'
    )
  })

  it('mixes strings and object values correctly', () => {
    expect(classnames('btn', { active: true, disabled: false }, 'large')).toBe(
      'btn active large'
    )
  })

  it('returns empty string when all values are falsy', () => {
    expect(classnames(undefined, null, false)).toBe('')
  })

  it('handles nested falsy object properties gracefully', () => {
    const input = {
      btn: false,
      active: true,
      large: undefined
    }
    expect(classnames(input)).toBe('active')
  })
})
