import React from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import ClienteContainer from "./ClienteContainer";
import ServiciosContainer from "./ServiciosContainer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteForm from "../forms/ClienteForm";

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
    <Grid container alignContent="flex-start" sx={{ height: "100%", width: "100%" }} gap={2}>
      <Grid
        sx={{ width: "100%" }}
        alignItems={"center"}
        justifyItems={"center"}
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
          <Typography variant="h6" align="center">
            Nueva Cita
          </Typography>
        </Paper>
      </Grid>
      <Grid container size={12} gap={2}>
        <Grid size={12} gap={2}>
          <ClienteForm />
        </Grid>
        <Grid size={12} gap={2}>
          <ServiciosContainer />
        </Grid>
        <Grid
          container
          size={12}
          gap={4}
          justifyContent={"flex-end"}
          sx={{ margin: "2rem 1rem" }}
        >
          <Grid>
            <Button variant="text" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NuevaCitaContainer;
