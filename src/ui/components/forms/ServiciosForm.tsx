import { useEffect, useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ServiciosInput from "../Inputs/ServiciosInput";
import HoraInput from "../Inputs/HoraInput";
import { Servicio } from "../../types/Servicio";
import HoraFinInput from "../Inputs/HoraFinInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { getDuracion, addMinutesToHora } from "../../utils/utils";

type ServiciosFormProps = {
  cellID: string;
  estilista: string;
  hora: string;
};

const ServiciosForm = ({ estilista, hora, cellID }: ServiciosFormProps) => {
  const { updateDuracion, updateService, removeServiceFromCita, handleAlert } =
    useAgendaContext();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [horaFin, setHoraFin] = useState<string>(addMinutesToHora(hora, 30));

  const handleRemove = () => {
    removeServiceFromCita({
      rowIndex: 0,
      cellID,
      servicio: { id: 0, nombre: "", precio: 0 },
      estilista,
      horaInicio: hora,
      horaFin,
      duracion: 0,
      fecha: "",
    });
  };

  const handleChangeHoraFin = (newHoraFin: string) => {
    if (newHoraFin <= hora) {
      handleAlert("La hora de fin debe ser posterior a la hora de inicio", "error");
      return;
    }
    const duracion = getDuracion(hora, newHoraFin);
    // Solo se refleja el nuevo valor en el input si updateDuracion lo acepta;
    // si hay choque de horario, el input se queda en el último valor válido
    // en vez de mostrar una hora que en realidad no se guardó.
    const success = updateDuracion(cellID, newHoraFin, duracion);
    if (success) {
      setHoraFin(newHoraFin);
    }
  };

  const handleServicioChange = (newServicio: Servicio | null) => {
    if (newServicio) {
      setServicio(newServicio);
      updateService(cellID, newServicio);
    }
  };

  // Sincroniza una sola vez al montar: EmptyCell crea la entrada con
  // horaFin = horaInicio, mientras el input local ya arranca en hora+30min.
  // Los cambios posteriores del usuario se validan y aplican directamente
  // en handleChangeHoraFin.
  useEffect(() => {
    const duracion = getDuracion(hora, horaFin);
    updateDuracion(cellID, horaFin, duracion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <Stack
        sx={{
          width: "100%",
          backgroundColor: "grey.100",
          borderRadius: 1,
          p: 1,
        }}
        gap={1}
        alignItems="center"
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6">{estilista.toUpperCase()}</Typography>
          <IconButton
            size="small"
            aria-label="Quitar servicio"
            onClick={handleRemove}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        <ServiciosInput value={servicio} onChange={handleServicioChange} />
        <Box component="div" sx={{ display: "flex", gap: 1, width: "100%" }}>
          <HoraInput label="Inicio" hora={hora} readOnly={true} />
          <HoraFinInput
            label="Fin"
            hora={horaFin}
            readOnly={false}
            onChange={handleChangeHoraFin}
          />
        </Box>
      </Stack>
  );
};

export default ServiciosForm;
