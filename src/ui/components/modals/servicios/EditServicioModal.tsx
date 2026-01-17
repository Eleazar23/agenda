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
import { useServiciosCtx } from "../../../contexts/ServiciosContext";

type Props = {
  isOpen: boolean;
  rowIndex: number;
  onClose?: () => void;
  initialData?: any;
};

function EditServicioModal({ isOpen, rowIndex, onClose, initialData }: Props) {
  const [formData, setFormData] = useState<Servicio>(
    initialData || {
      id: 0,
      nombre: "",
      precio: "",
    }
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof Servicio, string>>
  >({});

  const { editServicio } = useServiciosCtx();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Servicio]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (data: Servicio) => {
    const nextErrors: Partial<Record<keyof Servicio, string>> = {};
    if (!data.nombre?.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (
      !data.precio ||
      isNaN(Number(data.precio)) ||
      Number(data.precio) <= 0
    ) {
      nextErrors.precio = "El precio debe ser un número mayor que cero.";
    }
    return nextErrors;
  };

  const handleSave = () => {
    const { id, nombre, precio } = formData;
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    editServicio(rowIndex, { id, nombre, precio });
    if (onClose) onClose();
  };

  const handleClose = () => {
    setErrors({});
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Servicio</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" mt={1} gap={2}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField
            label="Precio"
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.precio}
            helperText={errors.precio}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditServicioModal;
