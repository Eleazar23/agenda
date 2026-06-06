import React from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import ClienteContainer from "./ClienteContainer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteForm from "../forms/ClienteForm";
import ServiciosCard from "../cards/ServiciosCard";

const NuevaCitaContainer = () => {
  const { cita, handleCancelarCita, guardarCita, handleAlert } =
    useAgendaContext();

  const handleCancelar = () => {
    handleCancelarCita();
  };

  const handleGuardar = () => {
    // const {cita} = agendaData
    const nombreLen = cita.nombreCliente.length;
    const phoneLen = cita.telefonoCliente.length;

    if (nombreLen < 1) {
      return handleAlert("Nombre de cliente incorrecto", "error");
    }
    if (phoneLen > 1 && phoneLen < 10) {
      return handleAlert(
        `\"Telefono\" debe contener 10 digitos | Ingreso: ${phoneLen}`,
        "error",
      );
    }
    if (phoneLen < 1) {
      return handleAlert('Falta ingresar "Telefono"', "error");
    }
    guardarCita();
  };
  return (
    <Stack
      alignContent="flex-start"
      sx={{ height: "100%", width: "100%", backgroundColor: "grey.50" }}
      gap={2}
    >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 48,
            padding: "5px 0px",
          }}
        >
          <Typography variant="h5" align="center">
            Nueva Cita
          </Typography>
        </Paper>
          <ClienteForm />
          <ServiciosCard />
          <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", p:1}} gap={1}>
            <Button variant="text" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
    </Stack>
  );
};

export default NuevaCitaContainer;
