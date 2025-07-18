import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from './api'

const mockFetch = vi.fn()

global.fetch = mockFetch

const BASE_URL = import.meta.env.VITE_TMDB_API_URL
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('calls GET with correct headers and url', async () => {
    const mockData = { success: true }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const result = await api.get('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        })
      })
    )

    expect(result).toEqual(mockData)
  })

  it('handles error responses correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Erro de API')
    })

    await expect(api.get('/erro')).rejects.toThrow('Erro de API')
  })

  it('sends POST body and method correctly', async () => {
    const body = { name: 'Jonathan' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })

    await api.post('/users', body)

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/users`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body)
      })
    )
  })
})
