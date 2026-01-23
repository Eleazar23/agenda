import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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

const ServiciosForm = ({
  estilista,
  hora,
  cellID,
}: ServiciosFormProps) => {
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
    <Grid container gap={1} size={12} wrap="nowrap" sx={{ height: "100%" }}>
      <Grid size={3}>
        <EstilistaInput ctxValue={estilista} readOnly />
      </Grid>
      <Grid size={4}>
        <ServiciosInput value={servicio} onChange={handleServicioChange} />
      </Grid>
      <Grid size={3}>
        <HoraInput label="Inicio" hora={hora} readOnly={true} />
      </Grid>
      <Grid size={3}>
        <HoraFinInput
          label="Fin"
          hora={horaFin}
          readOnly={false}
          onChange={handleChangeHoraFin}
        />
      </Grid>
    </Grid>
  );
};

export default ServiciosForm;
