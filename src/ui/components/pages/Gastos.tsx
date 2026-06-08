import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GastosTable from "../tables/GastosTable";
import { GastosCtxProvider, useGastosCtx } from "../../contexts/GastosCtx";
import GastoModal from "../modals/GastoModal";
import { Gasto } from "../../types/Gasto";
import FechaInput from "../Inputs/FechaInput";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { Search } from "@mui/icons-material";
import SearchInput from "../Inputs/SearchInput";

const STYLES = {
  gastosContainer: {
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
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    gap: 4,
  },
} as const;

const Gastos = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | undefined>();
  const [totalGastos, setTotalGastos] = useState(0);
  const [download, setDownload] = useState(false);
  const [fecha, setFecha] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = () => {
    setEditingGasto(undefined);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEditingGasto(undefined);
  };

  const handleEditGasto = (gasto: Gasto) => {
    setEditingGasto(gasto);
    setIsOpenModal(true);
  };

  const handleFechaChange = useCallback(
    (inputName: string, newFecha: string) => {
      setFecha(newFecha);
    },
    [setFecha],
  );
  const handleDownload = () => {
    // Lógica para descargar el reporte en Excel
    setDownload(true);
  };
  return (
    <GastosCtxProvider>
      <Grid
        container
        sx={STYLES.gastosContainer}
        direction="column"
        spacing={2}
      >
        <Grid container size={12}>
          <Paper sx={STYLES.paper}>
            <Grid container component="div" sx={STYLES.actionBar}>
              <Grid size={4}>
                <FechaInput ctxValue={fecha} ctxDispatch={handleFechaChange} />
              </Grid>
              <Grid size={4} sx={{ display: "flex", justifyContent: "center" }}>
                <SearchInput
                  placeholder="Buscar gasto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                />
              </Grid>
              <Grid
                size={4}
                sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Agregar Gasto
                </Button>
                <IconButton
                  color="primary"
                  aria-label="download Gastos"
                  onClick={handleDownload}
                >
                  <DownloadForOfflineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container size={12} sx={STYLES.tableContainer}>
          <GastosTable
            onEdit={handleEditGasto}
            setTotalGastos={setTotalGastos}
            fecha={fecha}
            download={download}
            setDownload={setDownload}
            searchTerm={searchTerm}
          />
        </Grid>
        <Grid container size={12}>
          <Paper sx={STYLES.paper}>
            <Box component="div" sx={STYLES.footer}>
              <Typography variant="h6">{`Total: $${totalGastos.toFixed(2)}`}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <GastoModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        initialGasto={editingGasto}
      />
    </GastosCtxProvider>
  );
};

export default Gastos;
