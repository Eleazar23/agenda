import { Grid } from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";

const ClienteForm = () => {
  const { agendaData, setAgendaData } = useAgendaContext();
  const { cita } = agendaData;
  const { cliente } = cita;

  const dispatchCliente = (value: string) =>{
    setAgendaData((prevData) => ({
      ...prevData,
      cita: { ...cita, cliente: { ...cliente, nombre: value } },
    }));

  }

  const dispatchPhone = (value : string) =>{
    console.log('PhoneValue', value)
        setAgendaData({
      ...agendaData,
      cita: { ...cita, cliente: { ...cliente, phone: value } },
    });
  }


  return (
    <Grid container gap={1} sx={{ width: "100%" }}>
      <ClienteInput contextValue={cliente.nombre} dispatchContext={dispatchCliente} />
      <PhoneInput valueContext={cliente.phone} dispatchContext={dispatchPhone} />
    </Grid>
  );
};

export default ClienteForm;
