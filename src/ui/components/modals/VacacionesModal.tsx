import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { capitalizeFirstLetter, formatDateFromHTML } from "../../utils/utils";

interface Vacacion {
  inicio: string;
  fin: string;
}

interface Estilista {
  id: number;
  name: string;
  telefono: string;
  role: string;
  vacaciones?: Vacacion[];
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  estilistaData: Estilista;
};

const VacacionesModal: React.FC<Props> = ({ isOpen, onClose, rowIndex, estilistaData }) => {
  const { handleAlert, editEstilista } = useEstilistasCtx();
  const [vacaciones, setVacaciones] = useState<Vacacion[]>(estilistaData.vacaciones || []);
  const [nuevoInicio, setNuevoInicio] = useState("");
  const [nuevoFin, setNuevoFin] = useState("");

  // Sincroniza con los datos actuales del estilista cada vez que se abre el modal.
  useEffect(() => {
    if (isOpen) {
      setVacaciones(estilistaData.vacaciones || []);
      setNuevoInicio("");
      setNuevoFin("");
    }
  }, [isOpen, estilistaData]);

  const handleAgregarVacacion = () => {
    if (!nuevoInicio || !nuevoFin) {
      handleAlert("Selecciona la fecha de inicio y fin de las vacaciones", "error");
      return;
    }
    if (nuevoInicio > nuevoFin) {
      handleAlert("La fecha de inicio debe ser anterior a la fecha de fin", "error");
      return;
    }
    const inicio = formatDateFromHTML(nuevoInicio);
    const fin = formatDateFromHTML(nuevoFin);
    setVacaciones((prev) => [...prev, { inicio, fin }]);
    setNuevoInicio("");
    setNuevoFin("");
  };

  const handleQuitarVacacion = (index: number) => {
    setVacaciones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    await editEstilista(rowIndex, { ...estilistaData, vacaciones });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Vacaciones de {capitalizeFirstLetter(estilistaData.name)}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 320 }}>
          <Stack spacing={1}>
            {vacaciones.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sin vacaciones registradas
              </Typography>
            ) : (
              vacaciones.map((v, index) => (
                <Stack
                  key={`${v.inicio}-${v.fin}-${index}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: 1, px: 1.5, py: 0.5 }}
                >
                  <Typography variant="body2">
                    {v.inicio} — {v.fin}
                  </Typography>
                  <IconButton size="small" onClick={() => handleQuitarVacacion(index)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              type="date"
              label="Inicio"
              variant="outlined"
              size="small"
              value={nuevoInicio}
              onChange={(e) => setNuevoInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="date"
              label="Fin"
              variant="outlined"
              size="small"
              value={nuevoFin}
              onChange={(e) => setNuevoFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button type="button" variant="outlined" onClick={handleAgregarVacacion}>
              Agregar
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" variant="contained" onClick={handleGuardar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VacacionesModal;
