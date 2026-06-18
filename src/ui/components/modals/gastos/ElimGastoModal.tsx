import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { Gasto } from "../../../types/Gasto";
import { useGastosCtx } from "../../../contexts/GastosCtx";

interface ElimGastoProps {
  gastoData?: Gasto;
  open: boolean;
  onClose: () => void;
}

function ElimGastoModal({ gastoData, open, onClose }: ElimGastoProps) {
  const { removeGasto } = useGastosCtx();

  const handleDelete = () => {
    if (gastoData && gastoData.id) {
      removeGasto(gastoData.id);
    }
    if (onClose) onClose();
  };
    const handleClose = () => {
    if (onClose) onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar Gasto</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Typography variant="body1" color="textSecondary">
            ¿Estás seguro de que deseas eliminar este gasto?
          </Typography>
          {gastoData && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: 2,
              }}
            >
              <Typography variant="subtitle1">
                {gastoData.proveedorNombre}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {gastoData.monto}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
            <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ElimGastoModal;
