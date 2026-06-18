import { useState } from "react";
import { Grid } from "@mui/material";
import EstilistaInput from "../Inputs/EstilistaInput";
import ServiciosInput from "../Inputs/ServiciosInput";
import HoraInput from "../Inputs/HoraInput";
import DuracionInput from "../Inputs/DuracionInput";
import { Servicio } from "../../types/Servicio";

type ServiciosFormProps = {
  rowIndex: null | number;
  estilista: string;
  hora: string;
  serviceIndex: number;
};

const CitaForm = ({
  estilista,
  hora,
  serviceIndex,
}: ServiciosFormProps) => {
  // const {agendaData, setAgendaData, updateService } = useAgendaContext();
  const [servicio, setServicio] = useState<Servicio | null>(null);

  return (
    <Grid container gap={1} size={12} wrap="nowrap" sx={{ height: "100%" }}>
      <Grid size={3}>
        <EstilistaInput ctxValue={estilista} readOnly />
      </Grid>
      <Grid size={4}>
        <ServiciosInput value={servicio} onChange={setServicio} />
      </Grid>
      <Grid size={3}>
        <HoraInput label="Inicio" hora={hora} />
      </Grid>
      <Grid size={2}>
        <DuracionInput serviceIndex={serviceIndex} />
      </Grid>
    </Grid>
  );
};

export default CitaForm;
