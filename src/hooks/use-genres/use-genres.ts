import { useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'
import { TMDBClient } from '@/services/tmdb'
import { STORAGE_GENRES_KEY } from '@/constants/storage'
import type { TMDBGenre } from '@/services/tmdb'

export function useGenres(): TMDBGenre[] {
  const [genres, setGenres] = useState<TMDBGenre[]>(() => {
    const storageGenres = loadFromStorage<TMDBGenre[]>(STORAGE_GENRES_KEY)

    if (!storageGenres) return []

    return storageGenres?.length > 0 ? storageGenres : []
  })

  useEffect(() => {
    const storageGenres = loadFromStorage<TMDBGenre[]>(STORAGE_GENRES_KEY)

    if (!storageGenres) {
      TMDBClient.getGenres().then((genres) => {
        setGenres(genres)
        saveToStorage(STORAGE_GENRES_KEY, genres)
      })
    }
  }, [])

  return genres
}
