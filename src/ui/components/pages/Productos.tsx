import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import { Add, Height } from "@mui/icons-material";
import { ProductosModal } from "../modals/ProductosModal";
import ProductosTable from "../tables/ProductsTable";
import { ProductosCtxProvider } from "../../contexts/ProductosCtx";
import AddProductoModal from "../modals/productos/AddProductoModal";

type Producto = {
  id?: string;
  name: string;
  marca: string;
  precio: string;
};

const mockData: Producto[] = [
  {
    name: "Shampoo",
    marca: "Pantene",
    precio: "150",
  },
];

const styles = {
  productosContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    maxHeight: "100vh",
    flexWrap: "nowrap",
  },
  paper: {
    padding: 2,
    width: "100%",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    gap: 4,
  },
  tableContainer: {
    height: "100%",
  },
};

const Productos = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <ProductosCtxProvider>
      <Grid
        container
        sx={styles.productosContainer}
        direction={"column"}
        spacing={2}
      >
        <Grid container size={12}>
          <Paper sx={styles.paper}>
            <Box component="div" sx={styles.actionBar}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAdding(true)}
              >
                Agregar Producto
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <ProductosTable />
        </Grid>
        <AddProductoModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
        />
      </Grid>
    </ProductosCtxProvider>
  );
};

export default Productos;
