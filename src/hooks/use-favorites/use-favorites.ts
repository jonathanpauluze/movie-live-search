import { useSyncExternalStore } from 'react'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'
import { STORAGE_FAVORITES_KEY } from '@/constants/storage'
import type { TMDBMovie } from '@/services/tmdb'

let favorites: TMDBMovie[] =
  loadFromStorage<TMDBMovie[]>(STORAGE_FAVORITES_KEY) ?? []
const listeners = new Set<VoidFunction>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function useFavorites() {
  const subscribe = (callback: VoidFunction) => {
    listeners.add(callback)
    return () => listeners.delete(callback)
  }

  const getSnapshot = () => favorites

  const state = useSyncExternalStore(subscribe, getSnapshot)

  function add(movie: TMDBMovie) {
    if (favorites.some((m) => m.id === movie.id)) return
    favorites = [...favorites, movie]
    saveToStorage(STORAGE_FAVORITES_KEY, favorites)
    notify()
  }

  function remove(id: number) {
    favorites = favorites.filter((m) => m.id !== id)
    saveToStorage(STORAGE_FAVORITES_KEY, favorites)
    notify()
  }

  function toggle(movie: TMDBMovie) {
    if (favorites.some((m) => m.id === movie.id)) {
      remove(movie.id)
    } else {
      add(movie)
    }
  }

  function has(id: number) {
    return favorites.some((m) => m.id === id)
  }

  return { favorites: state, add, remove, toggle, has }
}
