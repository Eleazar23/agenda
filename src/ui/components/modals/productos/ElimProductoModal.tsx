import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useProductosCtx } from "../../../contexts/ProductosCtx";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  productoData?: any;
};

function ElimProductoModal({ isOpen, onClose, productoData }: Props) {
  const { removeProducto } = useProductosCtx();

  const handleDelete = () => {
    if (productoData && productoData.id) {
      removeProducto(productoData.id);
    }
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar Producto</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Typography variant="body1" color="textSecondary">
            ¿Estás seguro de que deseas eliminar este producto?
          </Typography>
          {productoData && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {productoData.nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Marca: {productoData.marca}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Precio: ${productoData.precio}
              </Typography>
              {productoData.stock !== undefined && (
                <Typography variant="body2" color="textSecondary">
                  Stock: {productoData.stock}
                </Typography>
              )}
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

export default ElimProductoModal;