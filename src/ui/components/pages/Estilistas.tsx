import { useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import EstilistasTable from "../tables/EstilistasTable";
import EstilistaModal from "../modals/EstilistaModal";
import { useSnackbar } from "notistack";
import { EstilistasCtxProvider } from "../../contexts/EstilistaContext";



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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

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
            estilistasData={[]}
            setIsEditing={() => {}}
            handleAlert={handleAlert}
          />
        </Grid>
        <EstilistaModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          handleAlert={handleAlert}
          setIsOpenModal={setIsOpenModal}
        />
      </Grid>
    </EstilistasCtxProvider>
  );
};

export default Estilistas;
