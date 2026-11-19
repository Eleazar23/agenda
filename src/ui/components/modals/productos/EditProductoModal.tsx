import React, { useState } from "react";
import { Producto } from "../../../types/Producto";
import { TextField, Box } from "@mui/material";
import FormModalShell from "../FormModalShell";
import { useProductosCtx } from "../../../contexts/ProductosCtx";
import CantidadInput from "../../Inputs/CantidadInput";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  initialData?: Producto;
};

// El precio se edita como texto (p.ej. "12.") y se convierte al guardar
type ProductoForm = Omit<Producto, "precio"> & { precio: number | string };

function EditProductoModal({ isOpen, onClose, initialData }: Props) {
  const [formData, setFormData] = useState<ProductoForm>(
    initialData || {
      id: 0,
      nombre: "",
      marca: "",
      descripcion: "",
      precio: "",
      stock: 0,
    },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Producto, string>>>(
    {},
  );

  const { editProducto } = useProductosCtx();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Producto]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite dejar el campo vacío o en construcción (ej. "12.") mientras se escribe
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, precio: value }));
    if (errors.precio) {
      setErrors((prev) => ({ ...prev, precio: undefined }));
    }
  };

  const validate = (data: ProductoForm) => {
    const nextErrors: Partial<Record<keyof Producto, string>> = {};
    if (!data.nombre?.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (!data.marca?.trim()) nextErrors.marca = "La marca es obligatoria.";
    if (
      !data.precio ||
      isNaN(Number(data.precio)) ||
      Number(data.precio) <= 0
    ) {
      nextErrors.precio = "El precio debe ser un número mayor que cero.";
    }
    if (data.stock !== undefined && Number(data.stock) < 0) {
      nextErrors.stock = "El stock no puede ser negativo.";
    }
    return nextErrors;
  };

  const handleSave = () => {
    const { id, nombre, marca, precio, descripcion, stock } = formData;
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    editProducto({ id, nombre, marca, precio: Number(precio), descripcion, stock });
    if (onClose) onClose();
  };

  const handleClose = () => {
    setErrors({});
    if (onClose) onClose();
  };

  const handleStockChange = (value: number) => {
    setFormData((prev) => ({ ...prev, stock: value }));
    if (errors.stock) {
      setErrors((prev) => ({ ...prev, stock: undefined }));
    }
  };

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Producto"
      onSubmit={handleSave}
      maxWidth="xs"
      fullWidth
      dividers={false}
    >
      <Box display={"flex"} gap={2}>
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
          label="Marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.marca}
          helperText={errors.marca}
        />
      </Box>
      <Box display={"flex"} gap={2}>
        <TextField
          label="Precio"
          type="text"
          inputMode="decimal"
          name="precio"
          value={formData.precio}
          onChange={handlePrecioChange}
          fullWidth
          required
          error={!!errors.precio}
          helperText={errors.precio}
        />
        <CantidadInput
          label="Stock"
          name="stock"
          ctxValue={formData.stock}
          ctxOnChange={handleStockChange}
        />
      </Box>
      <TextField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        error={!!errors.descripcion}
        helperText={errors.descripcion}
      />
    </FormModalShell>
  );
}

export default EditProductoModal;
