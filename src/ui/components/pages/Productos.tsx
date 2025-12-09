import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { Height } from "@mui/icons-material";
import {
  ClientexCtxProvider,
  useClientesCtx,
} from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/ClientesModal";
import { ProductosModal } from "../modals/ProductosModal";
import ProductosTable from "../tables/ProductsTable";

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
    }
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
  // Usar useSate para abrir y cerrar modal
  const [isEditing, setIsEditing] = useState(false);
  const [productosData, setProductosData] = useState<Producto[]>([]);
  const [editedProductos, setEditedProductos] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);

  const getProductosData = () => {
    // Lógica para obtener los datos de los productos
    setProductosData(mockData);
    return mockData;
  };

  const handleGuardar = () => {
    // Lógica para guardar los cambios realizados en la tabla
    console.log("Guardar cambios:", editedProductos);
    setIsEditing(false);
  };

  const handleEdit = (node: any) => {
    const { rowIndex, data } = node;
    setEditedProductos((prev) => ({
      ...prev,
      [rowIndex]: data,
    }));
  };

  const handleCancelar = () => {
    getProductosData();
    setEditedProductos({});
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    // Simular la obtención de datos de productos desde una API o base de datos
    getProductosData();
  }, []);
  return (
    // Data Grid will fill the size of the parent container
    <ClientexCtxProvider>
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
                onClick={handleOpenModal}
              >
                Agregar Producto
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <ProductosTable
            productosData={productosData}
            setIsEditing={setIsEditing}
            handleEdit={handleEdit}
          />
        </Grid>
        {isEditing && (
          <Grid container size={12}>
            <Paper sx={styles.paper}>
              <Box component="div" sx={styles.actionBar}>
                <Button variant="text" color="primary" onClick={handleCancelar}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGuardar}
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
        <ProductosModal
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          onSave={(client) => {
            // Aquí puedes manejar la lógica para guardar el producto
            console.log("Producto Guardado:", client);
            setIsOpenModal(false);
          }}
        />
      </Grid>
    </ClientexCtxProvider>
  );
};

export default Productos;
