import React, { useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteForm, {
  NOMBRE_CLIENTE_INPUT_ID,
  TELEFONO_CLIENTE_INPUT_ID,
} from "../forms/ClienteForm";
import ServiciosCard from "../cards/ServiciosCard";
import FormActionsRow from "../forms/FormActionsRow";
import { servicioInputId } from "../../utils/utils";

// Se usa setTimeout (no rAF) porque el click en "Guardar" deja el foco del
// navegador en el propio botón después del evento; un timeout corto corre
// después de eso y del posible expand/Collapse del campo con error.
const focusFieldById = (id: string) => {
  setTimeout(() => {
    document.getElementById(id)?.focus();
  }, 50);
};

const NuevaCitaContainer = () => {
  const { cita, handleCancelarCita, guardarCita, handleAlert } =
    useAgendaContext();
  const [isSaving, setIsSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleCancelar = () => {
    handleCancelarCita();
  };

  const handleGuardar = async () => {
    if (isSaving) return;
    // const {cita} = agendaData
    const nombreLen = cita.nombreCliente.trim().length;
    const phoneLen = cita.telefonoCliente.length;

    if (nombreLen < 1) {
      setShowErrors(true);
      focusFieldById(NOMBRE_CLIENTE_INPUT_ID);
      return handleAlert("Nombre de cliente incorrecto", "error");
    }
    if (phoneLen > 1 && phoneLen < 10) {
      setShowErrors(true);
      focusFieldById(TELEFONO_CLIENTE_INPUT_ID);
      return handleAlert(
        `"Telefono" debe contener 10 digitos | Ingreso: ${phoneLen}`,
        "error",
      );
    }
    if (phoneLen < 1) {
      setShowErrors(true);
      focusFieldById(TELEFONO_CLIENTE_INPUT_ID);
      return handleAlert('Falta ingresar "Telefono"', "error");
    }
    if (!cita.clienteId) {
      setShowErrors(true);
      return handleAlert(
        "Selecciona un cliente de la lista o guárdalo como nuevo antes de continuar",
        "error",
      );
    }
    const servicioFaltante = cita.servicios.find((s) => !s.servicio?.id);
    if (servicioFaltante) {
      setShowErrors(true);
      focusFieldById(servicioInputId(servicioFaltante.cellID));
      return handleAlert(
        `Falta elegir el servicio de ${servicioFaltante.estilista.toUpperCase()}`,
        "error",
      );
    }
    setIsSaving(true);
    try {
      await guardarCita();
      setShowErrors(false);
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
            height: 36,
            padding: "5px 0px",
          }}
        >
          <Typography variant="h6" align="center">
            Nueva Cita
          </Typography>
        </Paper>
          <ClienteForm showErrors={showErrors} />
          <ServiciosCard showErrors={showErrors} />
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
