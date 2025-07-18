export function saveToStorage<T = unknown>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadFromStorage<T = unknown>(key: string): T | null {
  try {
    const rawValues = localStorage.getItem(key)

    const values = rawValues ? JSON.parse(rawValues) : null

    return values as T
  } catch {
    return null
  }
}
