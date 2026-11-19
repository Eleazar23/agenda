import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import FormModalShell from "./FormModalShell";
import PhoneInput from "../Inputs/PhoneInput";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";

interface Vacacion {
  inicio: string;
  fin: string;
}

interface Estilista {
  id: number;
  name: string;
  telefono: string;
  role: string;
  vacaciones?: Vacacion[];
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

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
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

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Estilista"
      onSubmit={handleSubmit}
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
    </FormModalShell>
  );
};
export default EditEstilistasModal;
