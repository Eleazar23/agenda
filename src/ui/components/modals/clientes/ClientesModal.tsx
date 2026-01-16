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
import { useClientesCtx } from "../../../contexts/ClientesCtx";
import { getCurrentDate } from "../../../utils/utils";

interface Client {
  id?: string;
  nombre: string;
  phone: string;
  correo?: string;
}

interface ClientDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave: (client: Client) => void;
  initialClient?: Client;
}

interface FormErrors {
  nombre?: string;
  phone?: string;
  correo?: string;
}

const validateForm = (formData: Client): FormErrors => {
  const errors: FormErrors = {};

  // Nombre validation
  if (!formData.nombre || formData.nombre.trim() === "") {
    errors.nombre = "El nombre es requerido";
  } else if (formData.nombre.trim().length < 3) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres";
  }

  // Phone validation
  if (!formData.phone || formData.phone.trim() === "") {
    errors.phone = "El teléfono es requerido";
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
    errors.phone = "El teléfono debe tener 10 dígitos";
  }

  // Email validation (optional but must be valid if provided)
  if (formData.correo && formData.correo.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      errors.correo = "El correo no es válido";
    }
  }

  return errors;
};

export const ClientesModal: React.FC<ClientDialogProps> = ({
  isOpen,
  onClose,
  initialClient,
}) => {
  const [formData, setFormData] = useState<Client>(
    initialClient || { nombre: "", phone: "", correo: "" },
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const { addCliente } = useClientesCtx();

  const handleClose = () => {
    setFormData({ nombre: "", phone: "", correo: "" });
    setErrors({});
    onClose?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = () => {
    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    addCliente({
      id: Date.now(),
      nombre: formData.nombre,
      phone: formData.phone,
      correo: formData.correo || "",
      lastVisit: getCurrentDate().formattedDate,
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Agregar Cliente
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
          />
          <TextField
            type="tel"
            name="phone"
            placeholder="Teléfono (10 dígitos)"
            value={formData.phone}
            onChange={handleChange}
            required
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={formData.correo}
            onChange={handleChange}
            error={!!errors.correo}
            helperText={errors.correo}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={handleClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
