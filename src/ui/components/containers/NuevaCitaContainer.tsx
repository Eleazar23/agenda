import React, { useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteForm from "../forms/ClienteForm";
import ServiciosCard from "../cards/ServiciosCard";
import FormActionsRow from "../forms/FormActionsRow";

const NuevaCitaContainer = () => {
  const { cita, handleCancelarCita, guardarCita, handleAlert } =
    useAgendaContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleCancelar = () => {
    handleCancelarCita();
  };

  const handleGuardar = async () => {
    if (isSaving) return;
    // const {cita} = agendaData
    const nombreLen = cita.nombreCliente.trim().length;
    const phoneLen = cita.telefonoCliente.length;

    if (nombreLen < 1) {
      return handleAlert("Nombre de cliente incorrecto", "error");
    }
    if (phoneLen > 1 && phoneLen < 10) {
      return handleAlert(
        `"Telefono" debe contener 10 digitos | Ingreso: ${phoneLen}`,
        "error",
      );
    }
    if (phoneLen < 1) {
      return handleAlert('Falta ingresar "Telefono"', "error");
    }
    if (!cita.clienteId) {
      return handleAlert(
        "Selecciona un cliente de la lista o guárdalo como nuevo antes de continuar",
        "error",
      );
    }
    setIsSaving(true);
    try {
      await guardarCita();
    } finally {
      setIsSaving(false);
    }
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
            <FormActionsRow
              onCancel={handleCancelar}
              onConfirm={handleGuardar}
              confirmLabel="Guardar"
              confirmDisabled={isSaving}
            />
          </Box>
    </Stack>
  );
};

export default NuevaCitaContainer;
