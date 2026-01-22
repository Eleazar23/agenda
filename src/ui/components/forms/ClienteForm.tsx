import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";

const ClienteForm = () => {
  const {
    cita,
    setCita,
    searchClienteByPhone,
    searchClienteByNombre,
    handleAlert,
  } = useAgendaContext();
  // const { cita } = agendaData;

  const dispatchCliente = (value: string) => {
    setCita((prevCita) => ({
      ...prevCita,
      nombreCliente: value,
    }));
  };

  const dispatchPhone = (value: string) => {
    setCita((prevCita) => ({
      ...prevCita,
      telefonoCliente: value,
    }));
  };

  const searchByNombre = (nombre: string) => {
    // Implement search logic here
    const cliente = searchClienteByNombre(nombre);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      setCita((prevCita) => ({
        ...prevCita,
        nombreCliente: cliente.nombre,
        telefonoCliente: cliente.phone,
      }));
      return;
    }
    handleAlert("Cliente no encontrado", "error");
  };

  const searchByPhone = (phone: string) => {
    // Implement search logic here
    const cliente = searchClienteByPhone(phone);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      setCita((prevCita) => ({
        ...prevCita,
        nombreCliente: cliente.nombre,
        telefonoCliente: cliente.phone,
      }));
      return;
    }
    handleAlert("Cliente no encontrado", "error");
  };

  return (
    <Card variant="outlined">
      <CardHeader title="Cliente" />
      <Divider sx={{ margin: "0 1rem" }} />
      <CardContent>
        <Grid container gap={1} sx={{ width: "100%" }}>
          <ClienteInput
            contextValue={cita.nombreCliente}
            dispatchContext={dispatchCliente}
            handleSearch={searchByNombre}
          />
          <PhoneInput
            valueContext={cita.telefonoCliente}
            dispatchContext={dispatchPhone}
            handleSearch={searchByPhone}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClienteForm;
