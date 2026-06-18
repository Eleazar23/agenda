import { useState } from "react";
import { Button, Grid, Paper } from "@mui/material";
import ProductosTable from "../tables/ProductsTable";
import { ProductosCtxProvider } from "../../contexts/ProductosCtx";
import AddProductoModal from "../modals/productos/AddProductoModal";
import SearchInput from "../Inputs/SearchInput";

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
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    width: "100%",
    gap: 1,
  },
  tableContainer: {
    height: "100%",
  },
};

const Productos = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
            <Grid container component="div" sx={styles.actionBar}>
              <Grid size={4} />
              <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
                <SearchInput
                  placeholder="Buscar producto (Nombre | Marca)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                />
              </Grid>
              <Grid
                size={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsAdding(true)}
                >
                  Agregar Producto
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container sx={styles.tableContainer} size={12}>
          <ProductosTable searchTerm={searchTerm} />
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
