const BASE_URL = import.meta.env.VITE_TMDB_API_URL
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      accept: 'application/json'
    },
    ...options
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Erro na requisição')
  }

  return response.json()
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, options),
  post: <T>(
    url: string,
    body: unknown,
    options?: Omit<RequestInit, 'method' | 'body'>
  ) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options
    }),
  put: <T>(
    url: string,
    body: unknown,
    options?: Omit<RequestInit, 'method' | 'body'>
  ) =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options
    }),
  delete: <T>(url: string, options?: Omit<RequestInit, 'method'>) =>
    request<T>(url, {
      method: 'DELETE',
      ...options
    })
}
