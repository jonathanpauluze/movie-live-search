type ClassValue = string | Record<string, unknown> | undefined | null | false

export function classnames(...args: ClassValue[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return []
      if (typeof arg === 'string') return [arg]
      if (typeof arg === 'object') {
        return (
          Object.entries(arg)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => Boolean(value))
            .map(([key]) => key)
        )
      }
      return []
    })
    .join(' ')
}
