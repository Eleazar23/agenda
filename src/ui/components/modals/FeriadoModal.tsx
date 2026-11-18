import React, { useEffect, useMemo, useState } from "react";
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
import { useAgendaContext } from "../../contexts/AgendaContext";
import { useFeriadosCtx } from "../../contexts/FeriadosCtx";
import { formatDateFromHTML, formatDateToHTML, getTargetDate } from "../../utils/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const FeriadoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { fecha } = useAgendaContext();
  const { feriados, addFeriado, removeFeriado } = useFeriadosCtx();
  const [nuevaFecha, setNuevaFecha] = useState(() => formatDateToHTML(fecha));
  const [nombre, setNombre] = useState("");
  const year = getTargetDate(fecha).get("year");

  // Cada vez que se abre el modal, la fecha del formulario arranca en la
  // fecha que se está viendo en la Agenda.
  useEffect(() => {
    if (isOpen) {
      setNuevaFecha(formatDateToHTML(fecha));
    }
  }, [isOpen, fecha]);

  // "feriados" ya llega filtrado por año desde la BD (AgendaContext lo
  // mantiene sincronizado con el año de la fecha seleccionada); aquí solo se
  // ordena para mostrarlo cronológicamente.
  const feriadosDelAnio = useMemo(
    () =>
      [...feriados].sort(
        (a, b) => getTargetDate(a.fecha).valueOf() - getTargetDate(b.fecha).valueOf(),
      ),
    [feriados],
  );

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaFecha || !nombre.trim()) return;
    await addFeriado(formatDateFromHTML(nuevaFecha), nombre.trim());
    setNuevaFecha(formatDateToHTML(fecha));
    setNombre("");
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Feriados {year}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 340 }}>
          <Stack spacing={1}>
            {feriadosDelAnio.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sin feriados registrados para {year}
              </Typography>
            ) : (
              feriadosDelAnio.map((f) => (
                <Stack
                  key={f.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: 1, px: 1.5, py: 0.5 }}
                >
                  <Typography variant="body2">
                    {f.fecha} — {f.nombre}
                  </Typography>
                  <IconButton size="small" onClick={() => removeFeriado(f.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))
            )}
          </Stack>
          <Box
            component="form"
            onSubmit={handleAgregar}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <TextField
              type="date"
              label="Fecha"
              variant="outlined"
              size="small"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Nombre"
              variant="outlined"
              size="small"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Año Nuevo"
              fullWidth
            />
            <Button type="submit" variant="outlined" onClick={handleAgregar}>
              Agregar
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button type="button" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeriadoModal;
