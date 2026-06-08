import { useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import ServiciosTable from "../tables/ServiciosTable";
import { ServiciosCtxProvider } from "../../contexts/ServiciosContext";
import AddServicioModal from "../modals/servicios/AddServicioModal";
import { Search } from "@mui/icons-material";
import SearchInput from "../Inputs/SearchInput";

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
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    width: "100%",
    gap: 1,
  },
  tableContainer: {
    height: "100%",
  },
};

export default function Servicios() {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
            <Grid component="div" sx={styles.actionBar}>
              <Grid size={4} />
              <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
                <SearchInput
                  placeholder="Buscar servicio (Nombre)"
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
                  Agregar Servicio
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid container sx={styles.tableContainer} size={12}>
          <ServiciosTable searchTerm={searchTerm} />
        </Grid>
        <AddServicioModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
        />
      </Grid>
    </ServiciosCtxProvider>
  );
}
