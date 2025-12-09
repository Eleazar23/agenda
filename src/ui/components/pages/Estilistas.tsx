import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { Height } from "@mui/icons-material";
import {
  ClientexCtxProvider,
  useClientesCtx,
} from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/ClientesModal";
import EstilistasTable from "../tables/EstilistasTable";

type Estilista = {
  name: string;
  phone: string;
};

const mockData: Estilista[] = [
  {
    name: "Eleazar Celis",
    phone: "312 210 5197",
  },{
    name: "Michelle Celis",
    phone: "312 210 5197",
  },
];

const styles = {
  clientesContainer: {
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

const Estilistas = () => {
  // Usar useSate para abrir y cerrar modal
  const [isEditing, setIsEditing] = useState(false);
  const [estilistasData, setEstilistasData] = useState<Estilista[]>([]);
  const [editedEstilistas, setEditedEstilistas] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);



  const getEstilistasData = () => {
    // Lógica para obtener los datos de los clientes
    setEstilistasData(mockData);
    return mockData;
  };

  const handleGuardar = () => {
    // Lógica para guardar los cambios realizados en la tabla
    console.log("Guardar cambios:", editedEstilistas);
    setIsEditing(false);
  };

  const handleEdit = (node: any) => {
    const {rowIndex, data} = node;
    setEditedEstilistas((prev) => ({
      ...prev,
      [rowIndex]: data,
    }));
  };

    const handleCancelar = () => {
    getEstilistasData();
    setEditedEstilistas({});
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    // Simular la obtención de datos de estilistas desde una API o base de datos
    getEstilistasData();
  }, []);
  return (
    // Data Grid will fill the size of the parent container
    <ClientexCtxProvider>
      <Grid
        container
        sx={styles.clientesContainer}
        direction={"column"}
        spacing={2}
      >
        <Grid container size={12}>
          <Paper sx={styles.paper}>
            <Box component="div" sx={styles.actionBar}>
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Agregar Estilista
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <EstilistasTable
            estilistasData={estilistasData}
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
        <ClientesModal
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          onSave={(client) => {
            // Aquí puedes manejar la lógica para guardar el cliente
            console.log("Estilista guardado:", client);
            setIsOpenModal(false);
          }}
        />
      </Grid>
    </ClientexCtxProvider>
  );
};

export default Estilistas;
