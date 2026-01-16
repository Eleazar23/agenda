import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormHelperText,
} from "@mui/material";
import PhoneInput from "../../Inputs/PhoneInput";
import { useClientesCtx } from "../../../contexts/ClientesCtx";

interface Cliente {
  id: number;
  nombre: string;
  phone: string;
  correo: string;
  lastVisit: string;
}

interface EditClienteModalProps {
  isOpen: boolean;
  rowIndex: number;
  onClose?: () => void;
  initialData?: Cliente;
}

const EditClienteModal: React.FC<EditClienteModalProps> = ({
  isOpen,
  rowIndex,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<Cliente>(
    initialData || { nombre: "", phone: "", correo: "", id: 0, lastVisit: "" }
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
    setFormData((prev) => ({ ...prev, phone: value }));
    if (isPhoneError) {
      setIsPhoneError(false);
      setPhoneErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, phone } = formData;
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

    if (!phone) {
      setIsPhoneError(true);
      setPhoneErrorMsg("El teléfono es obligatorio");
      hasErrors = true;
    } else if (phone.length < 10) {
      setIsPhoneError(true);
      setPhoneErrorMsg("El número de teléfono debe tener al menos 10 dígitos");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // onSave(rowIndex, formData);
    editCliente(rowIndex, formData);
    onClose?.();
  };

  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }} id="edit-cliente-dialog-title">
        Editar Cliente
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
              valueContext={formData.phone}
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

export default EditClienteModal;
