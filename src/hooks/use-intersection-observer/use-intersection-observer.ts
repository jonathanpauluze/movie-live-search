import { useEffect, useRef } from 'react'

export function useIntersectionObserver<T extends Element = HTMLElement>(
  callback: VoidFunction,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<T | null>(null)

  useEffect(() => {
    const target = observerRef.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback()
      }
    }, options)

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return observerRef
}
