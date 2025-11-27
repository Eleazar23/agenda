import { Grid } from "@mui/material";
import EstilistaInput from "../Inputs/EstilistaInput";
import SeriviceInput from "../Inputs/ServiceInput";
import HoraInput from "../Inputs/HoraInput";
import DuracionInput from "../Inputs/DuracionInput";

type Servicio = {
  rowIndex: null | number;
  estilista: string;
//   servicio: string;
  hora: string;
  serviceIndex: number;
};

const ServiciosForm = ({estilista, hora, serviceIndex}:Servicio) => {
    // const {agendaData, setAgendaData, updateService } = useAgendaContext();

    return (
        <Grid container gap={1} size={12} wrap="nowrap" sx={{height:"100%"}}>
            <Grid size={3}>
                <EstilistaInput  ctxValue={estilista} readOnly/>
            </Grid>
            <Grid size={4}>
                <SeriviceInput serviceIndex={serviceIndex} />
            </Grid>
            <Grid size={3}>
                <HoraInput hora={hora} />
            </Grid>
            <Grid size={2}>
                <DuracionInput serviceIndex={serviceIndex} />
            </Grid>
        </Grid>
    )
}

export default ServiciosForm;