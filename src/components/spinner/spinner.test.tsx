import { render, screen } from '@testing-library/react'
import { Spinner } from '.'

describe('Spinner component', () => {
  it('renders correctly', () => {
    render(<Spinner />)

    const wrapper = screen.getByRole('presentation', { hidden: true })
    expect(wrapper).toBeInTheDocument()
  })

  it('uses default size "md"', () => {
    render(<Spinner />)

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('data-size', 'md')
  })

  it('renders with size "sm"', () => {
    render(<Spinner size="sm" />)

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('data-size', 'sm')
  })

  it('renders with size "lg"', () => {
    render(<Spinner size="lg" />)

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('data-size', 'lg')
  })
})
