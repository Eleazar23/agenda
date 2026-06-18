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

interface Client {
  id?: string;
  name: string;
  marca: string;
  precio: string;
}

interface ClientDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave: (client: Client) => void;
  initialClient?: Client;
}

export const ProductosModal: React.FC<ClientDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
}) => {
  const [formData, setFormData] = useState<Client>(
    initialClient || { name: "", marca: "", precio: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: "", marca: "", precio: "" });
  };

  if (!isOpen) return null;

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
          <TextField
            type="text"
            name="name"
            placeholder="Nombre del Producto"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            type="text"
            name="marca"
            placeholder="Marca"
            value={formData.marca}
            onChange={handleChange}
            required
          />
          <TextField
            type="tel"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
