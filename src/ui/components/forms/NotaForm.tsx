import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Nota } from "../../types/Nota";
import { Estilista } from "../../types/Estilista";
import FechaInput from "../Inputs/FechaInput";

type NotaFormData = Omit<Nota, "id"> & { id?: number };

type Props = {
  onSubmit: (nota: NotaFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Nota;
  fechaDefault: string;
};

const NotaForm = ({ onSubmit, onCancel, initialData, fechaDefault }: Props) => {
  const [estilistas, setEstilistas] = useState<Estilista[]>([]);
  const [formData, setFormData] = useState<NotaFormData>(
    initialData || {
      nota: "",
      estilistaId: 0,
      estilistaNombre: "",
      estado: false,
      fecha: fechaDefault,
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.api.getEstilistas().then(setEstilistas).catch(() => setEstilistas([]));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nota.trim()) newErrors.nota = "La nota es requerida";
    if (!formData.estilistaId) newErrors.estilistaId = "Selecciona un estilista";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, nota: value }));
    if (errors.nota) setErrors((prev) => ({ ...prev, nota: "" }));
  };

  const handleEstilistaChange = (_event: unknown, estilista: Estilista | null) => {
    setFormData((prev) => ({
      ...prev,
      estilistaId: estilista?.id || 0,
      estilistaNombre: estilista?.displayName || estilista?.name || "",
    }));
    if (errors.estilistaId) setErrors((prev) => ({ ...prev, estilistaId: "" }));
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, estado: e.target.checked }));
  };

  const handleFechaChange = (_inputName: string, fecha: string) => {
    setFormData((prev) => ({ ...prev, fecha }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
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
        label="Nota"
        name="nota"
        value={formData.nota}
        onChange={handleNotaChange}
        error={!!errors.nota}
        helperText={errors.nota}
        multiline
        rows={3}
        fullWidth
      />

      <Autocomplete
        options={estilistas}
        getOptionLabel={(estilista) => estilista.displayName || estilista.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={estilistas.find((es) => es.id === formData.estilistaId) || null}
        onChange={handleEstilistaChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Estilista"
            error={!!errors.estilistaId}
            helperText={errors.estilistaId}
          />
        )}
      />

      <FechaInput ctxValue={formData.fecha} ctxDispatch={handleFechaChange} />

      <FormControlLabel
        control={
          <Checkbox checked={formData.estado} onChange={handleEstadoChange} />
        }
        label="Cumplida"
      />

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

export default NotaForm;
