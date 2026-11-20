import { useCallback, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import GastosTable from "../tables/GastosTable";
import { GastosCtxProvider } from "../../contexts/GastosCtx";
import GastoModal from "../modals/GastoModal";
import { Gasto } from "../../types/Gasto";
import FechaInput from "../Inputs/FechaInput";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";
import { formatMoney } from "../../utils/utils";

const STYLES = {
  paper: {
    padding: 2,
    width: "100%",
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
      <CrudPageLayout
        actionBar={
          <PageActionBar
            left={
              <FechaInput
                ctxValue={fecha}
                ctxDispatch={handleFechaChange}
                variant="outlined"
                size="small"
              />
            }
            center={
              <SearchInput
                placeholder="Buscar gasto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            }
            right={
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Agregar Gasto
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadForOfflineIcon />}
                  onClick={handleDownload}
                >
                  Descargar
                </Button>
              </>
            }
          />
        }
        footer={
          <Paper sx={STYLES.paper}>
            <Box component="div" sx={STYLES.footer}>
              <Typography variant="h6">{`Total: ${formatMoney(totalGastos)}`}</Typography>
            </Box>
          </Paper>
        }
      >
        <GastosTable
          onEdit={handleEditGasto}
          setTotalGastos={setTotalGastos}
          fecha={fecha}
          download={download}
          setDownload={setDownload}
          searchTerm={searchTerm}
        />
      </CrudPageLayout>

      <GastoModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        initialGasto={editingGasto}
      />
    </GastosCtxProvider>
  );
};

export default Gastos;
