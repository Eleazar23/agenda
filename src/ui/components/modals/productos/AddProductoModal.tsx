import React, { useState } from "react";
import {Producto} from "../../../types/Producto";
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
import { useProductosCtx } from "../../../contexts/ProductosCtx";

interface ClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialProducto?: Producto;
}

interface FormErrors {
  nombre?: string;
  marca?: string;
  precio?: string;
  stock?: string;
  descripcion?: string;
}

const AddProductoModal: React.FC<ClientDialogProps> = ({
  isOpen,
  onClose,
  initialProducto,
}) => {
  const [formData, setFormData] = useState<Producto>(
    initialProducto || {
      id: 0,
      nombre: "",
      marca: "",
      precio: "0",
      stock: 0,
      descripcion: "",
    },
  );
  // const { addEstilista } = useEstilistasCtx();
  const [errors, setErrors] = useState<FormErrors>({});
  const { addProducto } = useProductosCtx();

  const validateForm = (formData: Producto): FormErrors => {
    const errors: FormErrors = {};
    // Nombre validation
    if (!formData.nombre || formData.nombre.trim() === "") {
      errors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    // Marca validation
    if (!formData.marca || formData.marca.trim() === "") {
      errors.marca = "La marca es requerida";
    } else if (formData.marca.trim().length < 2) {
      errors.marca = "La marca debe tener al menos 2 caracteres";
    }
    // Precio validation
    if (!formData.precio) {
      errors.precio = "El precio es requerido";
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo";
    }
    // Stock validation
    if (formData.stock === undefined || formData.stock === null) {
      errors.stock = "El stock es requerido";
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errors.stock = "El stock debe ser un número no negativo";
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: nombre, value } = e.target;
    setFormData((prev) => ({ ...prev, [nombre]: value }));
    // Clear error for this field when user starts typing
    if (errors[nombre as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [nombre]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, marca, precio } = formData;
    console.log("Submitting form with data:", { nombre, marca, precio });
    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    addProducto({ ...formData, id: Date.now() });
    setFormData({ id: 0, nombre: "", marca: "", precio: "0", stock: 0, descripcion: "" });
    onClose();
  };

  // if (!isOpen) return null;

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Agregar Producto
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="text"
              name="nombre"
              label="Nombre"
              variant="outlined"
              value={formData.nombre}
              onChange={handleChange}
              required
              error={!!errors.nombre}
            />
            <TextField
              type="text"
              name="marca"
              label="Marca"
              variant="outlined"
              value={formData.marca}
              onChange={handleChange}
              required
              error={!!errors.marca}
            />
            <PrecioInput
              error={!!errors.precio}
              onChange={handleChange}
              value={formData.precio}
              variant="outlined"
            />
            <TextField
              type="number"
              name="stock"
              label="Stock"
              variant="outlined"
              value={formData.stock}
              onChange={handleChange}
              required
              error={!!errors.stock}
              slotProps={{ htmlInput: { min: "0" } }}
            />
          </Box>
          <TextField
            type="text"
            name="descripcion"
            label="Descripción"
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={3}
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
export default AddProductoModal;
