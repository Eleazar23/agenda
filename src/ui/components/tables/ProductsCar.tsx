import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

type Props = {
    products: {
        nombre: string;
        precio: number;
        cantidad: number;
    }[];
}

interface Column {
  id: 'nombre' | 'precio' | 'cantidad';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'nombre', label: 'Nombre', minWidth: 170 },
  { id: 'precio', label: 'Precio', minWidth: 100, format: (value: number) => value.toLocaleString('en-US') },
  { id: 'cantidad', label: 'Cantidad', minWidth: 100, format: (value: number) => value.toLocaleString('en-US') },
];

function ProductsCar({ products }: Props) {
    const [page, setPage] = React.useState(0);
    // const [isPagination, setIsPagination] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

      const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <>
    <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              return (
                <TableRow hover tabIndex={-1} key={product.nombre}>
                  {columns.map((column) => {
                    const value = product[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        products.length > 5 && (
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />)
      }
    </>
  )
}

export default ProductsCar