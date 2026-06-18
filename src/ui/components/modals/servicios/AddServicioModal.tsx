import React, { useState } from "react";
import { Servicio } from "../../../types/Servicio";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import PrecioInput from "../../Inputs/PrecioInput";
import { useServiciosCtx } from "../../../contexts/ServiciosContext";

interface ServicioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialServicio?: Servicio;
}

interface FormErrors {
  nombre?: string;
  precio?: string;
}

const AddServicioModal: React.FC<ServicioDialogProps> = ({
  isOpen,
  onClose,
  initialServicio,
}) => {
  const [formData, setFormData] = useState<Servicio>(
    initialServicio || {
      id: 0,
      nombre: "",
      precio: 0,
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const { addServicio } = useServiciosCtx();

  const validateForm = (formData: Servicio): FormErrors => {
    const errors: FormErrors = {};
    // Nombre validation
    if (!formData.nombre || formData.nombre.trim() === "") {
      errors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    // Precio validation
    if (formData.precio === undefined || formData.precio === null) {
      errors.precio = "El precio es requerido";
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) < 0) {
      errors.precio = "El precio debe ser un número positivo";
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    addServicio({ ...formData, id: Date.now() });
    setFormData({ id: 0, nombre: "", precio: 0 });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Agregar Servicio
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            type="text"
            name="nombre"
            label="Nombre"
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
          />
          <PrecioInput
            error={!!errors.precio}
            onChange={handleChange}
            value={formData.precio}
            variant="outlined"
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

export default AddServicioModal;
