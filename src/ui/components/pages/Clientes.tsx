import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { Height } from "@mui/icons-material";
import {
  ClientexCtxProvider,
  useClientesCtx,
} from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/ClientesModal";

type Cliente = {
  name: string;
  phone: string;
  correo: string;
  lastVisit: string;
  bitacora: string;
};

const mockData: Cliente[] = [
  {
    name: "Eleazar Celis",
    phone: "312 210 5197",
    correo: "francisco.celish@gmail.com",
    lastVisit: "23/08/2023",
    bitacora: "",
  },{
    name: "Michelle Celis",
    phone: "312 210 5197",
    correo: "francisco.celish@gmail.com",
    lastVisit: "23/08/2023",
    bitacora: "",
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

const Clientes = () => {
  // Usar useSate para abrir y cerrar modal
  const [isEditing, setIsEditing] = useState(false);
  const [clientesData, setClientesData] = useState<Cliente[]>([]);
  const [editedClientes, setEditedClientes] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);



  const getClientesData = () => {
    // Lógica para obtener los datos de los clientes
    setClientesData(mockData);
    return mockData;
  };

  const handleGuardar = () => {
    // Lógica para guardar los cambios realizados en la tabla
    console.log("Guardar cambios:", editedClientes);
    setIsEditing(false);
  };

  const handleEdit = (node: any) => {
    const {rowIndex, data} = node;
    setEditedClientes((prev) => ({
      ...prev,
      [rowIndex]: data,
    }));
  };

    const handleCancelar = () => {
    getClientesData();
    setEditedClientes({});
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    // Simular la obtención de datos de clientes desde una API o base de datos
    getClientesData();
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
                Agregar Cliente
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <ClientsTables
            clientesData={clientesData}
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
            console.log("Cliente guardado:", client);
            setIsOpenModal(false);
          }}
        />
      </Grid>
    </ClientexCtxProvider>
  );
};

export default Clientes;
