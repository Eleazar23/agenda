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
import { globalData } from "../../mock/globalData";
import EstilistaModal from "../modals/EstilistaModal";
import { useSnackbar } from "notistack";
import { EstilistasCtxProvider, useEstilistasCtx } from "../../contexts/EstilistaContext";

type Estilista = {
  name: string;
  phone: string;
};

const mockData: Estilista[] = [
  {
    name: "Eleazar Celis",
    phone: "312 210 5197",
  },
  {
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
type Alert = "success" | "error" | "info" | "warning";

const Estilistas = () => {
  // Usar useSate para abrir y cerrar modal
  const [isEditing, setIsEditing] = useState(false);
  const [estilistasData, setEstilistasData] = useState<Estilista[]>([]);
  const [editedEstilistas, setEditedEstilistas] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  // const getEstilistasData = () => {
  //   // Lógica para obtener los datos de los clientes
  //   console.log("Obteniendo datos de estilistas...");
  //   setEstilistasData([...globalData.estilistas]);
  //   return globalData.estilistas;
  // };

  const handleGuardar = () => {
    // Lógica para guardar los cambios realizados en la tabla
    console.log("Guardar cambios:", editedEstilistas);
    setIsEditing(false);
  };

  const handleEdit = (node: any) => {
    const { rowIndex, data } = node;
    setEditedEstilistas((prev) => ({
      ...prev,
      [rowIndex]: data,
    }));
    console.log("Estilista editado:", rowIndex, data);
  };

  const handleCancelar = () => {
    // getEstilistasData();
    setEditedEstilistas({});
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  // const handleSaveModal = (estilista: Estilista) => {
  //   // Aquí puedes manejar la lógica para guardar el cliente
  //   globalData.estilistas.push({
  //     ...estilista,
  //     displayName:
  //       estilista.name.charAt(0).toUpperCase() + estilista.name.slice(1),
  //   });
  //   setEstilistasData([...globalData.estilistas]);
  //   handleAlert("Estilista guardado con éxito", "success");
  //   console.log({ globalData });
  //   setIsOpenModal(false);
  // };

  return (
    // Data Grid will fill the size of the parent container
    <EstilistasCtxProvider>
      <Grid
        container
        sx={styles.clientesContainer}
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
            handleAlert={handleAlert}
          />
        </Grid>
        {/* {isEditing && (
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
        )} */}
        <EstilistaModal
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          handleAlert={handleAlert}
          setIsOpenModal={setIsOpenModal}
        />
      </Grid>
    </EstilistasCtxProvider>
  );
};

export default Estilistas;
