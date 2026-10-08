import React, { useState } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useAgendaContext } from "../../contexts/AgendaContext";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
  },
  containerClickable: {
    cursor: "pointer",
  },
  label: {
    // Fondo blanco (pastilla) detrás del texto para separarlo del fondo.
    backgroundColor: "#FFFFFF",
    fontWeight: 600,
    fontSize: "0.75rem",
    textAlign: "center" as const,
    borderRadius: "999px",
    padding: "2px 8px",
    maxWidth: "calc(100% - 8px)",
  },
};

const BlockedCell = (params: CustomCellRendererProps) => {
  const { removeBloqueo } = useAgendaContext();
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { motivo, bloqueoId } = params.value || {};
  const isBloqueoPropio = Boolean(bloqueoId);
  const { bloqueos } = theme.palette.agenda;
  const colors = isBloqueoPropio ? bloqueos.comida : bloqueos.vacaciones;

  const handleClick = () => {
    if (!isBloqueoPropio) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (bloqueoId) {
      await removeBloqueo(bloqueoId);
    }
  };

  return (
    <>
      <Box
        sx={{
          ...styles.container,
          backgroundColor: colors.bg,
          ...(isBloqueoPropio ? styles.containerClickable : {}),
        }}
        onClick={handleClick}
      >
        <Typography
          sx={{
            ...styles.label,
            backgroundColor: colors.chipBg,
            color: colors.chipText,
          }}
          noWrap
        >
          {colors.icon} {motivo || "Bloqueado"}
        </Typography>
      </Box>
      {isBloqueoPropio ? (
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Eliminar descanso</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Quieres eliminar este bloqueo de "{motivo}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default React.memo(
  BlockedCell,
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);
