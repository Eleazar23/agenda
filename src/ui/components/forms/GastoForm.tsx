import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Gasto } from "../../types/Gasto";
import { formatDateToHTML, formatDateFromHTML } from "../../utils/utils";
import FechaInput from "../Inputs/FechaInput";

type Props = {
  onSubmit: (gasto: Gasto) => Promise<void>;
  onCancel: () => void;
  initialData?: Gasto;
};

const GastoForm = ({ onSubmit, onCancel, initialData }: Props) => {
  const [formData, setFormData] = useState<Omit<Gasto, "id"> & { id?: number }>(
    initialData || {
      proveedorNombre: "",
      monto: 0,
      fecha: "",
      categoria: "",
      descripcion: "",
      metodoPago: "efectivo",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.proveedorNombre.trim())
      newErrors.proveedorNombre = "El nombre del proveedor es requerido";
    if (formData.monto <= 0) newErrors.monto = "El monto debe ser mayor a 0";
    if (!formData.fecha) newErrors.fecha = "La fecha es requerida";
    if (!formData.categoria.trim())
      newErrors.categoria = "La categoría es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  //   const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const htmlDateValue = e.target.value; // YYYY-MM-DD from input
  //     const ddmmyyyyDate = formatDateFromHTML(htmlDateValue); // Convert to DD-MM-YYYY
  //     setFormData((prev) => ({
  //       ...prev,
  //       fecha: ddmmyyyyDate,
  //     }));
  //     if (errors.fecha) {
  //       setErrors((prev) => ({ ...prev, fecha: "" }));
  //     }
  //   };

  const handleFechaChange = (inputName: string, fecha: string) => {
    // Lógica para filtrar los reportes por fecha
    setFormData((prev) => ({
      ...prev,
      fecha,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = initialData
        ? {
            ...formData,
            id: initialData.id,
          }
        : formData;
      await onSubmit(dataToSubmit as Gasto);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Nombre del Proveedor"
        name="proveedorNombre"
        value={formData.proveedorNombre}
        onChange={handleChange}
        error={!!errors.proveedorNombre}
        helperText={errors.proveedorNombre}
        fullWidth
      />

      <TextField
        label="Monto"
        name="monto"
        type="number"
        value={formData.monto}
        onChange={handleChange}
        error={!!errors.monto}
        helperText={errors.monto}
        fullWidth
      />
      <FechaInput ctxValue={formData.fecha} ctxDispatch={handleFechaChange} />
      <TextField
        label="Categoría"
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        error={!!errors.categoria}
        helperText={errors.categoria}
        fullWidth
      />

      <TextField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Método de Pago</InputLabel>
        <Select
          name="metodoPago"
          value={formData.metodoPago}
          onChange={handleChange as any}
          label="Método de Pago"
        >
          <MenuItem value="efectivo">Efectivo</MenuItem>
          <MenuItem value="tarjeta">Tarjeta</MenuItem>
          <MenuItem value="transferencia">Transferencia</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Stack>
    </Box>
  );
};

export default GastoForm;
