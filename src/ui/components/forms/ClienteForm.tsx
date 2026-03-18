import { useState } from "react";
import {
  Box,
  Button,
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
    addCliente
  } = useAgendaContext();
  const [isNewCliente, setIsNewCliente] = useState(false);
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

  const searchByNombre = async (nombre: string) => {
    // Implement search logic here
    const cliente = await searchClienteByNombre(nombre);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      setCita((prevCita) => ({
        ...prevCita,
        nombreCliente: cliente.nombre,
        telefonoCliente: cliente.phone,
      }));
      return;
    }
    setIsNewCliente(() => true);
    handleAlert("Cliente no encontrado", "error");
  };

  const searchByPhone = async (phone: string) => {
    // Implement search logic here
    const cliente = await searchClienteByPhone(phone);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      setCita((prevCita) => ({
        ...prevCita,
        nombreCliente: cliente.nombre,
        telefonoCliente: cliente.phone,
      }));
      return;
    }
    setIsNewCliente(() => true);
    handleAlert("Cliente no encontrado", "error");
  };

  const handleGuardarNuevoCliente = () => {
    // Logic to save new cliente - MongoDB will auto-generate the ID
    if (!cita.nombreCliente || !cita.telefonoCliente) {
      handleAlert("Nombre y teléfono son obligatorios", "error");
      return;
    }
    addCliente({
      nombre: cita.nombreCliente,
      phone: cita.telefonoCliente,
      correo: "",
      lastVisit: "",
    } as any);
    setIsNewCliente(false);
  };

  return (
    <Grid size={12}>
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
            autoFocus={true}
          />
          {isNewCliente && (
            <Box component="div" display={"flex"} sx={{ width: "100%" } } justifyContent={"flex-end"}>
              <Button variant="contained" onClick={handleGuardarNuevoCliente}>
                Guardar nuevo cliente
              </Button>
            </Box>
          )}
        </Grid>
      </CardContent>
    </Card>
    </Grid>
  );
};

export default ClienteForm;
