import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { addMinutesToHora, capitalizeFirstLetter, getHrsObj, getOfficeHours } from "../../utils/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const officeHours = getOfficeHours();
// La hora de inicio no puede ser la última del día: siempre debe quedar al
// menos un slot de 30 min después para poder elegir una hora de fin.
const startOptions = officeHours.slice(0, -1).map((h) => h.label24);

const generateEndOptions = (horaInicio: string) => {
  const options: string[] = [];
  let current = horaInicio;
  for (let i = 0; i < 16; i++) {
    current = addMinutesToHora(current, 30);
    if (current > "20:00") break;
    options.push(current);
  }
  return options;
};

type HoraOption = { label24: string; label12: string };
const toHoraOptions = (horas: string[]): HoraOption[] =>
  horas.map((hora) => ({ label24: hora, label12: getHrsObj(hora)?.label12 || hora }));

const BloqueoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { estilistas: estilistasFull, addBloqueo } = useAgendaContext();
  const estilistas = useMemo(
    () => estilistasFull.filter((e) => e.role === "estilista").map((e) => e.name),
    [estilistasFull],
  );

  const [estilista, setEstilista] = useState("");
  const [horaInicio, setHoraInicio] = useState(startOptions[0] || "09:00");
  const endOptions = useMemo(() => generateEndOptions(horaInicio), [horaInicio]);
  const [horaFin, setHoraFin] = useState(endOptions[0] || horaInicio);
  const [motivo, setMotivo] = useState("Comida");

  const startHoraOptions = useMemo(() => toHoraOptions(startOptions), []);
  const endHoraOptions = useMemo(() => toHoraOptions(endOptions), [endOptions]);

  // Reinicia el formulario cada vez que se abre el modal.
  useEffect(() => {
    if (!isOpen) return;
    setEstilista(estilistas[0] || "");
    setHoraInicio(startOptions[0] || "09:00");
    setMotivo("Comida");
  }, [isOpen, estilistas]);

  // Si cambia la hora de inicio, la hora de fin seleccionada puede quedar
  // inválida (anterior a la nueva hora de inicio); se ajusta a la primera
  // opción disponible.
  useEffect(() => {
    setHoraFin(endOptions[0] || horaInicio);
  }, [horaInicio, endOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estilista) return;
    await addBloqueo(estilista, horaInicio, horaFin, motivo.trim() || "Comida");
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Marcar descanso</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 280 }}
        >
          <FormControl fullWidth>
            <InputLabel>Estilista</InputLabel>
            <Select
              value={estilista}
              label="Estilista"
              onChange={(e) => setEstilista(e.target.value as string)}
            >
              {estilistas.map((nombre) => (
                <MenuItem key={nombre} value={nombre}>
                  {capitalizeFirstLetter(nombre)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            renderInput={(params) => (
              <TextField label="Hora inicio" variant="outlined" {...params} />
            )}
            disableClearable
            options={startHoraOptions}
            getOptionLabel={(option) => option.label12}
            isOptionEqualToValue={(option, value) => option.label24 === value.label24}
            value={startHoraOptions.find((h) => h.label24 === horaInicio) || undefined}
            onChange={(_e, newValue) => {
              if (newValue) setHoraInicio(newValue.label24);
            }}
            fullWidth
          />
          <Autocomplete
            renderInput={(params) => (
              <TextField label="Hora fin" variant="outlined" {...params} />
            )}
            disableClearable
            options={endHoraOptions}
            getOptionLabel={(option) => option.label12}
            isOptionEqualToValue={(option, value) => option.label24 === value.label24}
            value={endHoraOptions.find((h) => h.label24 === horaFin) || undefined}
            onChange={(_e, newValue) => {
              if (newValue) setHoraFin(newValue.label24);
            }}
            fullWidth
          />
          <TextField
            label="Motivo"
            variant="outlined"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Comida"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" onClick={handleSubmit} disabled={!estilista}>
          Marcar descanso
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BloqueoModal;
