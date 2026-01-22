import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import EstilistaInput from "../Inputs/EstilistaInput";
import ServiciosInput from "../Inputs/ServiciosInput";
import HoraInput from "../Inputs/HoraInput";
import { Servicio } from "../../types/Servicio";
import HoraFinInput from "../Inputs/HoraFinInput";
import { useAgendaContext } from "../../contexts/AgendaContext";

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
  // const {agendaData, setAgendaData, updateService } = useAgendaContext();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [horaFin, setHoraFin] = useState<string>(hora);
  const [duracion, setDuracion] = useState<number>(30);

  const handleChangeHoraFin = (newHoraFin: string) => {
    setHoraFin(newHoraFin);
  };

  const formatHoraFin = (hora: string) => {
    const hrFinArry = hora.split(" ");
    return hrFinArry[0];
  };

  const handleServicioChange = (newServicio: Servicio | null) => {
    console.log("Servicio cambiado a:", newServicio);
    if (newServicio) {
      updateService(cellID, newServicio);
    }
  };

  const handleDuracion = (horaInicio: string, horaFin: string) => {
    const formattedHoraFin = formatHoraFin(horaFin);
    const [startHrs, startMins] = horaInicio.split(":").map(Number);
    const [endHrs, endMins] = formattedHoraFin.split(":").map(Number);
    const startTotalMins = startHrs * 60 + startMins;
    const endTotalMins = endHrs * 60 + endMins;
    const diffMins = endTotalMins - startTotalMins;
    const realDiffMins = diffMins >= 0 ? diffMins : 0;
    // setDuracion(realDiffMins);
    updateDuracion(cellID, formattedHoraFin, realDiffMins);
    console.log("Duracion actualizada a:", diffMins);
  };

  useEffect(() => {
    handleDuracion(hora, horaFin);
  }, [horaFin]);

  useEffect(() => {
    if (servicio) {
      handleServicioChange(servicio);
    }
  }, [servicio]);

  return (
    <Grid container gap={1} size={12} wrap="nowrap" sx={{ height: "100%" }}>
      <Grid size={3}>
        <EstilistaInput ctxValue={estilista} readOnly />
      </Grid>
      <Grid size={4}>
        <ServiciosInput value={servicio} onChange={setServicio} />
      </Grid>
      <Grid size={3}>
        <HoraInput label="Inicio" hora={hora} readOnly={true} />
      </Grid>
      <Grid size={3}>
        {/* <HoraInput label="Fin" hora={horaFin} readOnly={false} onChange={handleChangeHoraFin} /> */}
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
