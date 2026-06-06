import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import EstilistaInput from "../Inputs/EstilistaInput";
import ServiciosInput from "../Inputs/ServiciosInput";
import HoraInput from "../Inputs/HoraInput";
import { Servicio } from "../../types/Servicio";
import HoraFinInput from "../Inputs/HoraFinInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { getDuracion } from "../../utils/utils";

type ServiciosFormProps = {
  cellID: string;
  estilista: string;
  hora: string;
};

const ServiciosForm = ({ estilista, hora, cellID }: ServiciosFormProps) => {
  const { updateDuracion, updateService } = useAgendaContext();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [horaFin, setHoraFin] = useState<string>(hora);

  const handleChangeHoraFin = (newHoraFin: string) => {
    setHoraFin(newHoraFin);
  };

  const handleServicioChange = (newServicio: Servicio | null) => {
    if (newServicio) {
      setServicio(newServicio);
      updateService(cellID, newServicio);
    }
  };

  useEffect(() => {
    const duracion = getDuracion(hora, horaFin);
    updateDuracion(cellID, horaFin, duracion);
  }, [hora, horaFin]);

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
        <Typography variant="h6">{estilista.toUpperCase()}</Typography>
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
