import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { useRef } from 'react'
import { useClickOutside } from '.'

type TestComponentProps = { onClickOutside: VoidFunction }
function TestComponent(props: Readonly<TestComponentProps>) {
  const { onClickOutside } = props

  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClickOutside)

  return (
    <>
      <div data-testid="outside">Outside</div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
    </>
  )
}

describe('useClickOutside hook', () => {
  const onClickOutside = vi.fn()

  beforeEach(() => {
    onClickOutside.mockReset()
  })

  it('calls callback when clicking outside', () => {
    const { getByTestId } = render(
      <TestComponent onClickOutside={onClickOutside} />
    )

    fireEvent.mouseDown(getByTestId('outside'))

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('does not call callback when clicking inside', () => {
    const { getByTestId } = render(
      <TestComponent onClickOutside={onClickOutside} />
    )

    fireEvent.mouseDown(getByTestId('inside'))

    expect(onClickOutside).not.toHaveBeenCalled()
  })
})
