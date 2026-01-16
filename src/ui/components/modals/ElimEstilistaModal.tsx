import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";

type Estilista = {
  id: number;
  name: string;
  phone: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  estilistaData: Estilista;
};

export default function ElimEstilistaModal({
  isOpen,
  onClose,
  estilistaData,
}: Props) {
  const { removeEstilista } = useEstilistasCtx();

  const handleClose = () => {
    onClose();
  };

  const handleAceptar = () => {
    // Lógica para eliminar el estilista usando estilistaId
    removeEstilista(estilistaData.id);
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Estas seguro de eliminar este estilista?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Nombre: ${estilistaData.name} - Telefono: ${estilistaData.phone}`}
            <br />
            <br />
            Una vez eliminado, no podras recuperar la informacion de este
            estilista.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAceptar} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
