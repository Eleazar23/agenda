import { useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import EstilistasTable from "../tables/EstilistasTable";
import EstilistaModal from "../modals/EstilistaModal";
import { useSnackbar } from "notistack";
import { EstilistasCtxProvider } from "../../contexts/EstilistaContext";
import SearchInput from "../Inputs/SearchInput";

const styles = {
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
    flexWrap: "nowrap",
    justifyContent: "space-between",
    width: "100%",
    gap: 1,
  },
  tableContainer: {
    height: "100%",
  },
} as const;
type Alert = "success" | "error" | "info" | "warning";

const Estilistas = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
            <Grid container component="div" sx={styles.actionBar}>
              <Grid size={4} /> {/* Spacer */}
              <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
                <SearchInput
                  placeholder="Buscar estilista ( Nombre | Telefono)"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClear={() => setSearchTerm("")}
                />
              </Grid>
              <Grid size={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Agregar Estilista
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <EstilistasTable
            searchTerm={searchTerm}
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
