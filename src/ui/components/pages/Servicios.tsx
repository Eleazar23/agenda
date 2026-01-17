import { useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ServiciosTable from "../tables/ServiciosTable";
import { ServiciosCtxProvider } from "../../contexts/ServiciosContext";
import AddServicioModal from "../modals/servicios/AddServicioModal";

const styles = {
  serviciosContainer: {
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

export default function Servicios() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <ServiciosCtxProvider>
      <Grid
        container
        sx={styles.serviciosContainer}
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
                Agregar Servicio
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <ServiciosTable />
        </Grid>
        <AddServicioModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
        />
      </Grid>
    </ServiciosCtxProvider>
  );
}
