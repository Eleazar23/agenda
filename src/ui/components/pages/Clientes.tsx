import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { ClientesCtxProvider } from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/clientes/ClientesModal";
import SearchInput from "../Inputs/SearchInput";
import { useThrottle } from "../../hooks/useThrottle";

type Cliente = {
  nombre: string;
  telefono: string;
  correo: string;
  lastVisit: string;
};

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
    justifyContent: "space-between",
    width: "100%",
    gap: 1,
  },
  tableContainer: {
    height: "100%",
  },
} as const;

const Clientes = () => {
  const [isEditing, setIsEditing] = useState(false);
  // const [clientesData, setClientesData] = useState<Cliente[]>(globalData.clientes);
  const [editedClientes, setEditedClientes] = useState<Record<number, Cliente>>(
    {},
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGuardar = useCallback(() => {
    console.log("Guardar cambios:", editedClientes);
    setIsEditing(false);
  }, [editedClientes]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = useCallback(
    (node: { rowIndex: number; data: Cliente }) => {
      const { rowIndex, data } = node;
      setEditedClientes((prev) => ({
        ...prev,
        [rowIndex]: data,
      }));
    },
    [],
  );

  const handleCancelar = useCallback(() => {
    setEditedClientes({});
    setIsEditing(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleSaveClient = useCallback(
    (client: { nombre: string; telefono: string; correo?: string }) => {
      const today = new Date();
      const lastVisit = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

      const newClient: Cliente = {
        nombre: client.nombre,
        telefono: client.telefono,
        correo: client.correo || "",
        lastVisit,
      };
      console.log("Cliente guardado:", newClient);
      setIsOpenModal(false);
    },
    [],
  );

  // useEffect(() => {
  //   setClientesData(globalData.clientes);
  // }, []);

  return (
    <ClientesCtxProvider>
      <Grid
        container
        sx={STYLES.clientesContainer}
        direction="column"
        spacing={2}
      >
        <Grid container size={12}>
          <Paper sx={STYLES.paper}>
            <Grid component="div" sx={STYLES.actionBar}>
              <Grid size={4} /> {/* Spacer */}
              <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
                <SearchInput
                  placeholder="Buscar cliente (nombre, teléfono, correo)"
                  onChange={handleSearchChange}
                />
              </Grid>
              <Grid
                size={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Agregar Cliente
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid container sx={STYLES.tableContainer} size={12}>
          <ClientsTables
            setIsEditing={setIsEditing}
            handleEdit={handleEdit}
            searchTerm={searchTerm}
          />
        </Grid>
        <ClientesModal
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          onSave={handleSaveClient}
        />
      </Grid>
    </ClientesCtxProvider>
  );
};

export default Clientes;
