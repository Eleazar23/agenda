import React, { useState } from "react";
import { Producto } from "../../../types/Producto";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useProductosCtx } from "../../../contexts/ProductosCtx";
import CantidadInput from "../../Inputs/CantidadInput";

type Props = {
  isOpen: boolean;
  rowIndex: number;
  onClose?: () => void;
  initialData?: any;
};

function EditProductoModal({ isOpen, rowIndex, onClose, initialData }: Props) {
  const [formData, setFormData] = useState<Producto>(
    initialData || {
      id: 0,
      nombre: "",
      marca: "",
      descripcion: "",
      precio: "",
      stock: "",
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

  const validate = (data: Producto) => {
    const nextErrors: Partial<Record<keyof Producto, string>> = {};
    if (!data.nombre?.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (!data.marca?.trim()) nextErrors.marca = "La marca es obligatoria.";
    if (!data.descripcion?.trim())
      nextErrors.descripcion = "La descripción es obligatoria.";
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
    editProducto(rowIndex, { id, nombre, marca, precio, descripcion, stock });
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
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" mt={1} gap={2}>
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
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
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
            {/* <TextField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              error={!!errors.stock}
              helperText={errors.stock}
            /> */}
          </Box>
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            error={!!errors.descripcion}
            helperText={errors.descripcion}
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

export default EditProductoModal;
