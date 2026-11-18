import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  isSaving: boolean;
  onSeguirEditando: () => void;
  onDescartar: () => void;
  onGuardar: () => void;
};

function CambiosSinGuardarDialog({
  open,
  isSaving,
  onSeguirEditando,
  onDescartar,
  onGuardar,
}: Props) {
  return (
    <Dialog open={open} onClose={onSeguirEditando} maxWidth="xs" fullWidth>
      <DialogTitle>Cambios sin guardar</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Estás cerrando la cita sin guardar los cambios. ¿Qué deseas hacer?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSeguirEditando} sx={{ mr: "auto" }}>
          Seguir editando
        </Button>
        <Button onClick={onDescartar} color="error">
          Descartar
        </Button>
        <Button
          onClick={onGuardar}
          variant="contained"
          disabled={isSaving}
          autoFocus
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CambiosSinGuardarDialog;
