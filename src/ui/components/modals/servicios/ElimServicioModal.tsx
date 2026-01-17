import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useServiciosCtx } from "../../../contexts/ServiciosContext";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  servicioData?: any;
};

function ElimServicioModal({ isOpen, onClose, servicioData }: Props) {
  const { removeServicio } = useServiciosCtx();

  const handleDelete = () => {
    if (servicioData && servicioData.id) {
      removeServicio(servicioData.id);
    }
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar Servicio</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Typography variant="body1" color="textSecondary">
            ¿Estás seguro de que deseas eliminar este servicio?
          </Typography>
          {servicioData && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {servicioData.nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Precio: ${servicioData.precio}
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

export default ElimServicioModal;
