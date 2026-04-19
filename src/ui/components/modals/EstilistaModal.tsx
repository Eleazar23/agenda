import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";

interface Estilista {
  id?: number;
  name: string;
  telefono: string;
}

interface ClientDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  // onSave: (client: Estilista) => void;
  initialClient?: Estilista;
  handleAlert?: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EstilistaModal: React.FC<ClientDialogProps> = ({
  isOpen,
  onClose,
  initialClient,
  handleAlert = () => {},
  setIsOpenModal,
}) => {
  const [formData, setFormData] = useState<Estilista>(
    initialClient || { name: "", telefono: "" }
  );
  const [isNameError, setIsNameError] = useState(false);
  const { addEstilista } = useEstilistasCtx();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePhone = (value: string) => {
    setFormData((prev) => ({ ...prev, telefono: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, telefono } = formData;

    if (!name && !telefono) {
      handleAlert("Por favor completa todos los campos", "error");
      return;
    }

    if (!name) {
      setIsNameError(true);
      handleAlert("El nombre es obligatorio", "error");
      setTimeout(() => setIsNameError(false), 3000);
      return;
    }

    if (!telefono) {
      handleAlert("El teléfono es obligatorio", "error");
      return;
    }

    if (telefono.length < 10) {
      handleAlert(
        "El número de teléfono debe tener al menos 10 dígitos",
        "error"
      );
      return;
    }
    addEstilista({ ...formData, id: Date.now() });
    setIsOpenModal(false);
    setFormData({ name: "", telefono: "" });
  };

  // if (!isOpen) return null;

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Agregar Estilista
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            type="text"
            name="name"
            variant="outlined"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            error={isNameError}
          />
          {/* <TextField
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
          /> */}
          <PhoneInput
            variant="outlined"
            valueContext={formData.telefono}
            dispatchContext={handleChangePhone}
            searchIcon={false}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EstilistaModal;
