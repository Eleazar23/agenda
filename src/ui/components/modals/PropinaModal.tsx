import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropinasForm from "../forms/PropinasForm";
import { Propina } from "../../types/Cita";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";

type Props = {
  open: boolean;
  onClose: () => void;
  propinas: Propina[];
  onAplicar: (propinas: Propina[]) => void;
  servicios: ServicioAgendado[];
  productos: ProductoInCita[];
  metodoDePagoDefault: string;
  totalCita: number;
};

// Se edita una copia de las propinas; solo se pasan a la cita al
// "Aplicar", así "Cancelar" descarta los cambios hechos en el modal.
// El padre lo monta solo mientras está abierto, para que el borrador
// arranque siempre desde las propinas actuales.
function PropinaModal({
  open,
  onClose,
  propinas,
  onAplicar,
  servicios,
  productos,
  metodoDePagoDefault,
  totalCita,
}: Props) {
  const [borrador, setBorrador] = useState<Propina[]>(propinas);

  const handleAplicar = () => {
    onAplicar(borrador);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>Propina</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <PropinasForm
          propinas={borrador}
          onChange={setBorrador}
          servicios={servicios}
          productos={productos}
          metodoDePagoDefault={metodoDePagoDefault}
          totalCita={totalCita}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleAplicar}>
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PropinaModal;
