import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ClearIcon from "@mui/icons-material/Clear";
import { Producto } from "../../types/Producto";
import { IconButton } from "@mui/material";

type Props = {
  products: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    total: number;
    estilista: string;
  }[];
  handleRemoveProducto: (id: number) => void;
};

interface Column {
  id: "nombre" | "precio" | "cantidad" | "total" | "acciones" | "estilista";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nombre", label: "Nombre", minWidth: 170 },
  { id: "estilista", label: "Estilista", minWidth: 170},
  {
    id: "precio",
    label: "Precio",
    minWidth: 100,
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "cantidad",
    label: "Cantidad",
    minWidth: 100,
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 100,
  },
];

function ProductsCar({ products, handleRemoveProducto }: Props) {
  const [page, setPage] = React.useState(0);
  // const [isPagination, setIsPagination] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
                <TableRow hover tabIndex={-1} key={product.id}>
                  <TableCell key={`${product.id}-${product.nombre}`}>
                    {product.nombre}
                  </TableCell>
                  <TableCell key={`${product.id}-${product.estilista}`}>
                    {product.estilista}
                  </TableCell>
                  <TableCell key={`${product.id}-${product.precio}`}>
                    {product.precio}
                  </TableCell>
                  <TableCell key={`${product.id}-${product.cantidad}`}>
                    {product.cantidad}
                  </TableCell>
                  <TableCell key={`${product.id}-${product.total}`}>
                    {product.total}
                  </TableCell>
                  <TableCell key={`${product.id}-acciones`}>
                    <IconButton aria-label="delete" size="small" onClick={() => handleRemoveProducto(product.id)}>
                      <ClearIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {products.length > 5 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}

export default ProductsCar;
