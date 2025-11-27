import { Grid } from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";

const ClienteForm = () => {
  const { agendaData, setAgendaData } = useAgendaContext();
  const { cita } = agendaData;

  const dispatchCliente = (value: string) =>{
    setAgendaData((prevData) => ({
      ...prevData,
      cita: { ...cita, nombreCliente: value } ,
    }));

  }

  const dispatchPhone = (value : string) =>{
    console.log('PhoneValue', value)
        setAgendaData(prevData => ({
      ...prevData,
      cita: { ...cita, telefonoCliente: value },
    })
  );
  }


  return (
    <Grid container gap={1} sx={{ width: "100%" }}>
      <ClienteInput contextValue={cita.nombreCliente} dispatchContext={dispatchCliente} />
      <PhoneInput valueContext={cita.telefonoCliente} dispatchContext={dispatchPhone} />
    </Grid>
  );
};

export default ClienteForm;
