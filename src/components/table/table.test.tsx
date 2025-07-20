import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '.'

describe('Table component', () => {
  it('renders table with all sections correctly', () => {
    render(
      <Table data-testid="table-root" wrapperClassName="custom-wrapper">
        <TableHeader data-testid="thead">
          <TableRow data-testid="tr-header">
            <TableHead data-testid="th">Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="tbody">
          <TableRow data-testid="tr-body">
            <TableCell data-testid="td">Cell content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByTestId('table-root')).toBeInTheDocument()
    expect(screen.getByTestId('thead')).toBeInTheDocument()
    expect(screen.getByTestId('tbody')).toBeInTheDocument()
    expect(screen.getByTestId('tr-header')).toBeInTheDocument()
    expect(screen.getByTestId('tr-body')).toBeInTheDocument()
    expect(screen.getByTestId('th')).toHaveTextContent('Header')
    expect(screen.getByTestId('td')).toHaveTextContent('Cell content')
  })
})
