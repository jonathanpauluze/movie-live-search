import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, act } from '@testing-library/react'
import { useIntersectionObserver } from '.'

let observeMock = vi.fn()
let disconnectMock = vi.fn()

function TestComponent(props: Readonly<{ onIntersect: VoidFunction }>) {
  const { onIntersect } = props
  const ref = useIntersectionObserver<HTMLDivElement>(onIntersect)

  return (
    <div ref={ref} data-testid="observed">
      Hello
    </div>
  )
}

describe('useIntersectionObserver hook', () => {
  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()

    const mockIntersectionObserver = vi.fn()

    mockIntersectionObserver.mockImplementation(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      Object.assign(this, {
        observe: observeMock,
        disconnect: disconnectMock,
        trigger: callback
      })
    })

    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver)
  })

  it('calls callback when element is intersecting', () => {
    const onIntersect = vi.fn()

    render(<TestComponent onIntersect={onIntersect} />)

    const observerInstance = (IntersectionObserver as unknown as Mock).mock
      .instances[0]

    act(() => {
      observerInstance.trigger([{ isIntersecting: true, target: {} }])
    })

    expect(onIntersect).toHaveBeenCalled()
  })

  it('does not call callback if not intersecting', () => {
    const onIntersect = vi.fn()

    render(<TestComponent onIntersect={onIntersect} />)

    const observerInstance = (IntersectionObserver as unknown as Mock).mock
      .instances[0]

    act(() => {
      observerInstance.trigger([{ isIntersecting: false, target: {} }])
    })

    expect(onIntersect).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const onIntersect = vi.fn()

    const { unmount } = render(<TestComponent onIntersect={onIntersect} />)

    unmount()

    expect(disconnectMock).toHaveBeenCalled()
  })
})
