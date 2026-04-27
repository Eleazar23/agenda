import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { set } from "mongoose";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";

interface Estilista {
  id: number;
  name: string;
  telefono: string;
  role: string;
}


interface ClientDialogProps {
  isOpen: boolean;
  rowIndex: number;
  onClose?: () => void;
  initialData?: Estilista;
  // handleAlert?: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

const EditEstilistasModal: React.FC<ClientDialogProps> = ({
  isOpen,
  rowIndex,
  onClose,
  initialData,
  // handleAlert = () => {},
}) => {
  const [formData, setFormData] = useState<Estilista>(
    initialData || { id: 0, name: "", telefono: "", role: "estilista" }
  );
  const [isNameError, setIsNameError] = useState(false);
  const { handleAlert, editEstilista } = useEstilistasCtx();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleRoleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
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

    editEstilista(rowIndex, formData);
  };

  // if (!isOpen) return null;

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Editar Estilista
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
          <PhoneInput
            variant="outlined"
            valueContext={formData.telefono}
            dispatchContext={handleChangePhone}
            searchIcon={false}
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              label="Rol"
            >
              <MenuItem value="estilista">Estilista</MenuItem>
              <MenuItem value="vendedor">Vendedor</MenuItem>
            </Select>
          </FormControl>
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
export default EditEstilistasModal;
