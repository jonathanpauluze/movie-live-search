import { useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'
import { STORAGE_THEME_KEY } from '@/constants/storage'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const storageTheme = loadFromStorage<Theme | null>(STORAGE_THEME_KEY)
    if (storageTheme) return storageTheme

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    saveToStorage(STORAGE_THEME_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
