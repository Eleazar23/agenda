import React, { useState } from "react";
import { Servicio } from "../../../types/Servicio";
import { TextField } from "@mui/material";
import FormModalShell from "../FormModalShell";
import { useServiciosCtx } from "../../../contexts/ServiciosContext";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  initialData?: Servicio;
};

// El precio se edita como texto y se convierte al guardar
type ServicioForm = Omit<Servicio, "precio"> & { precio: number | string };

function EditServicioModal({ isOpen, onClose, initialData }: Props) {
  const [formData, setFormData] = useState<ServicioForm>(
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

  const validate = (data: ServicioForm) => {
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
    editServicio({ id, nombre, precio: Number(precio) });
    if (onClose) onClose();
  };

  const handleClose = () => {
    setErrors({});
    if (onClose) onClose();
  };

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Servicio"
      onSubmit={handleSave}
      maxWidth="xs"
      fullWidth
      dividers={false}
    >
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
    </FormModalShell>
  );
}

export default EditServicioModal;
