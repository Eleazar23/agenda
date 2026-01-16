import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useSnackbar } from "notistack";
import { useClientesCtx } from "../../../contexts/ClientesCtx";

interface Cliente {
  id: number;
  nombre: string;
  phone: string;
  correo?: string;
  lastVisit?: string;
}

interface ElimClienteModalProps {
  isOpen: boolean;
  onClose?: () => void;
  clienteData?: Cliente;
  onConfirm?: (cliente: Cliente) => void;
}

const ElimClienteModal: React.FC<ElimClienteModalProps> = ({
  isOpen,
  onClose,
  clienteData,
  onConfirm,
}) => {
  const { removeCliente } = useClientesCtx();

  const handleConfirmDelete = () => {
    if (clienteData) {
      removeCliente(clienteData.id);
      onClose?.();
    }
  };

  if (!clienteData) return null;

  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }} id="elim-cliente-dialog-title">
        Eliminar Cliente
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 48, color: "warning.main" }} />
          <Typography variant="body1" align="center">
            ¿Estás seguro de que deseas eliminar al cliente?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {clienteData.nombre}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="error"
          onClick={handleConfirmDelete}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElimClienteModal;
