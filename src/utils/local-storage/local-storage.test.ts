import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveToStorage, loadFromStorage } from './local-storage'

describe('local-storage utils', () => {
  const key = 'test-key'

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('saves and loads a value correctly', () => {
    const data = { company: 'Planne', newEmployee: 'Jonathan' }
    saveToStorage(key, data)

    const result = loadFromStorage<typeof data>(key)
    expect(result).toEqual(data)
  })

  it('returns null if key does not exist', () => {
    const result = loadFromStorage('nonexistent-key')
    expect(result).toBeNull()
  })

  it('returns null if JSON.parse fails', () => {
    localStorage.setItem(key, '{ invalid json')
    const result = loadFromStorage(key)
    expect(result).toBeNull()
  })
})
