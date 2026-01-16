import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import {
  ClientexCtxProvider,
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
  },
  {
    name: "Michelle Celis",
    phone: "312 210 5197",
    correo: "francisco.celish@gmail.com",
    lastVisit: "23/08/2023",
    bitacora: "",
  },
];

const STYLES = {
  clientesContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    maxHeight: "100vh",
    flexWrap: "nowrap" as const,
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
} as const;

const Clientes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [clientesData, setClientesData] = useState<Cliente[]>(mockData);
  const [editedClientes, setEditedClientes] = useState<Record<number, Cliente>>({});
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleGuardar = useCallback(() => {
    console.log("Guardar cambios:", editedClientes);
    setIsEditing(false);
  }, [editedClientes]);

  const handleEdit = useCallback((node: { rowIndex: number; data: Cliente }) => {
    const { rowIndex, data } = node;
    setEditedClientes((prev) => ({
      ...prev,
      [rowIndex]: data,
    }));
  }, []);

  const handleCancelar = useCallback(() => {
    setClientesData(mockData);
    setEditedClientes({});
    setIsEditing(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleSaveClient = useCallback((client: { name: string; phone: string }) => {
    const newClient: Cliente = {
      ...client,
      correo: "",
      lastVisit: "",
      bitacora: "",
    };
    console.log("Cliente guardado:", newClient);
    setClientesData((prev) => [...prev, newClient]);
    setIsOpenModal(false);
  }, []);

  useEffect(() => {
    setClientesData(mockData);
  }, []);
  return (
    <ClientexCtxProvider>
      <Grid
        container
        sx={STYLES.clientesContainer}
        direction="column"
        spacing={2}
      >
        <Grid container size={12}>
          <Paper sx={STYLES.paper}>
            <Box component="div" sx={STYLES.actionBar}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenModal}
              >
                Agregar Cliente
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={STYLES.tableContainer} size={12}>
          <ClientsTables
            clientesData={clientesData}
            setIsEditing={setIsEditing}
            handleEdit={handleEdit}
          />
        </Grid>
        {isEditing && (
          <Grid container size={12}>
            <Paper sx={STYLES.paper}>
              <Box component="div" sx={STYLES.actionBar}>
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={handleCancelar}
                >
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
          onSave={handleSaveClient}
        />
      </Grid>
    </ClientexCtxProvider>
  );
};

export default Clientes;
