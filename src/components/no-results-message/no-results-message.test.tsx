import { render, screen } from '@testing-library/react'
import { NoResultsMessage } from '.'

describe('NoResultsMessage component', () => {
  it('displays the message with the query', () => {
    render(<NoResultsMessage query="Interestellar" />)

    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          'Nenhum resultado encontrado para “Interestellar”.'
      )
    ).toBeInTheDocument()
  })

  it('renderiza o link para o IMDB com a query corretamente', () => {
    render(<NoResultsMessage query="Interestellar" />)

    const imdbLink = screen.getByRole('link', {
      name: 'Buscar “Interestellar” no IMDB'
    })
    expect(imdbLink).toBeInTheDocument()
    expect(imdbLink).toHaveAttribute(
      'href',
      'https://www.imdb.com/find?q=Interestellar'
    )
  })

  it('renders the Google link with the query correctly', () => {
    render(<NoResultsMessage query="Interestellar" />)

    const googleLink = screen.getByRole('link', {
      name: 'Buscar “Interestellar” no Google'
    })
    expect(googleLink).toBeInTheDocument()
    expect(googleLink).toHaveAttribute(
      'href',
      'https://www.google.com/search?q=Interestellar+site:imdb.com'
    )
  })

  it('encodeURIComponent works with spaces or accents', () => {
    render(<NoResultsMessage query="filme épico 2024" />)

    const imdbLink = screen.getByRole('link', {
      name: 'Buscar “filme épico 2024” no IMDB'
    })

    expect(imdbLink).toHaveAttribute(
      'href',
      'https://www.imdb.com/find?q=filme%20%C3%A9pico%202024'
    )
  })
})
