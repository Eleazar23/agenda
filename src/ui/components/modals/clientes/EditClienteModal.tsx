import React, { useState } from "react";
import { TextField, Box, FormHelperText } from "@mui/material";
import FormModalShell from "../FormModalShell";
import PhoneInput from "../../Inputs/PhoneInput";
import { useClientesCtx } from "../../../contexts/ClientesCtx";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  lastVisit: string;
}

interface EditClienteModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialData?: Cliente;
}

const EditClienteModal: React.FC<EditClienteModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<Cliente>(
    initialData || { nombre: "", telefono: "", correo: "", id: 0, lastVisit: "" }
  );
  const [isNombreError, setIsNombreError] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [nombreErrorMsg, setNombreErrorMsg] = useState("");
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const {editCliente} = useClientesCtx();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "nombre" && isNombreError) {
      setIsNombreError(false);
      setNombreErrorMsg("");
    }
  };

  const handleChangePhone = (value: string) => {
    setFormData((prev) => ({ ...prev, telefono: value }));
    if (isPhoneError) {
      setIsPhoneError(false);
      setPhoneErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, telefono } = formData;
    let hasErrors = false;

    // Reset errors
    setIsNombreError(false);
    setIsPhoneError(false);
    setNombreErrorMsg("");
    setPhoneErrorMsg("");

    // Validation
    if (!nombre) {
      setIsNombreError(true);
      setNombreErrorMsg("El nombre es obligatorio");
      hasErrors = true;
    }

    if (!telefono) {
      setIsPhoneError(true);
      setPhoneErrorMsg("El teléfono es obligatorio");
      hasErrors = true;
    } else if (telefono.length < 10) {
      setIsPhoneError(true);
      setPhoneErrorMsg("El número de teléfono debe tener al menos 10 dígitos");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    editCliente(formData);
    onClose?.();
  };

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Cliente"
      onSubmit={handleSubmit}
      maxWidth="sm"
      fullWidth
    >
      <TextField
        type="text"
        name="nombre"
        variant="outlined"
        label="Nombre"
        placeholder="Nombre del cliente"
        value={formData.nombre}
        onChange={handleChange}
        required
        error={isNombreError}
        helperText={nombreErrorMsg}
        fullWidth
      />
      <Box sx={{ position: "relative" }}>
        <PhoneInput
          variant="outlined"
          valueContext={formData.telefono}
          dispatchContext={handleChangePhone}
          searchIcon={false}
        />
        {isPhoneError && (
          <FormHelperText error>{phoneErrorMsg}</FormHelperText>
        )}
      </Box>
      <TextField
        type="email"
        name="correo"
        variant="outlined"
        label="Correo Electrónico"
        placeholder="correo@ejemplo.com"
        value={formData.correo || ""}
        onChange={handleChange}
        fullWidth
      />
    </FormModalShell>
  );
};

export default EditClienteModal;
