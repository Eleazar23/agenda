import { Fragment, useEffect, useState } from "react";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ServiciosInput from "../Inputs/ServiciosInput";
import { Servicio } from "../../types/Servicio";
import HoraFinInput from "../Inputs/HoraFinInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { getDuracion, addMinutesToHora, servicioInputId } from "../../utils/utils";
import DeleteBtn from "../buttons/DeleteBtn";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

type ServiciosFormProps = {
  cellID: string;
  estilista: string;
  hora: string;
  showErrors?: boolean;
};

const ServiciosForm = ({
  estilista,
  hora,
  cellID,
  showErrors,
}: ServiciosFormProps) => {
  const { updateDuracion, updateService, removeServiceFromCita, handleAlert } =
    useAgendaContext();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [horaFin, setHoraFin] = useState<string>(addMinutesToHora(hora, 30));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Rojo solo tras un intento de Guardar fallido, y solo mientras no se
  // haya elegido servicio.
  const servicioVacio = showErrors && !servicio;
  // Mientras haya un error sin resolver, se muestra expandida sí o sí
  // (ignora el toggle manual) para que el input con el error nunca quede
  // oculto; en cuanto se elige un servicio, vuelve a mandar la preferencia
  // manual del usuario.
  const effectiveExpanded = isExpanded || servicioVacio;

  const handleRemove = () => {
    setIsConfirmOpen(false);
    removeServiceFromCita({
      rowIndex: 0,
      cellID,
      servicio: { id: 0, nombre: "", precio: 0 },
      estilista,
      horaInicio: hora,
      horaFin,
      duracion: 0,
      fecha: "",
    });
  };

  const handleChangeHoraFin = (newHoraFin: string) => {
    if (newHoraFin <= hora) {
      handleAlert("La hora de fin debe ser posterior a la hora de inicio", "error");
      return;
    }
    const duracion = getDuracion(hora, newHoraFin);
    // Solo se refleja el nuevo valor en el input si updateDuracion lo acepta;
    // si hay choque de horario, el input se queda en el último valor válido
    // en vez de mostrar una hora que en realidad no se guardó.
    const success = updateDuracion(cellID, newHoraFin, duracion);
    if (success) {
      setHoraFin(newHoraFin);
    }
  };

  const handleServicioChange = (newServicio: Servicio | null) => {
    if (newServicio) {
      setServicio(newServicio);
      updateService(cellID, newServicio);
    }
  };

  // Sincroniza una sola vez al montar: EmptyCell crea la entrada con
  // horaFin = horaInicio, mientras el input local ya arranca en hora+30min.
  // Los cambios posteriores del usuario se validan y aplican directamente
  // en handleChangeHoraFin.
  useEffect(() => {
    const duracion = getDuracion(hora, horaFin);
    updateDuracion(cellID, horaFin, duracion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Stack
        sx={{
          width: "100%",
          backgroundColor: "grey.100",
          borderRadius: 1,
          p: 1,
        }}
        gap={1}
        alignItems="center"
      >
        <Box
          component="div"
          onClick={() => setIsExpanded((prev) => !prev)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            cursor: "pointer",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {estilista.toUpperCase()}
            </Typography>
            {!effectiveExpanded && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {servicio?.nombre || "Sin servicio"} · {hora} - {horaFin}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" alignItems="center">
            <IconButton
              size="small"
              aria-label={effectiveExpanded ? "Colapsar servicio" : "Expandir servicio"}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded((prev) => !prev);
              }}
              sx={{
                transform: effectiveExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
            <DeleteBtn
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmOpen(true);
              }}
            />
          </Stack>
        </Box>
        <Collapse in={effectiveExpanded} sx={{ width: "100%" }}>
          <Stack gap={1} sx={{ width: "100%" }}>
            <ServiciosInput
              id={servicioInputId(cellID)}
              value={servicio}
              onChange={handleServicioChange}
              size="small"
              error={servicioVacio}
              helperText={servicioVacio ? "Selecciona un servicio" : undefined}
            />
            <Box component="div" sx={{ display: "flex", gap: 1, width: "100%" }}>
              <HoraFinInput
                label="Inicio"
                hora={hora}
                readOnly={true}
                size="small"
              />
              <HoraFinInput
                label="Fin"
                hora={horaFin}
                readOnly={false}
                onChange={handleChangeHoraFin}
                size="small"
              />
            </Box>
          </Stack>
        </Collapse>
      </Stack>
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Quitar servicio"
        confirmQuestion="¿Quieres quitar este servicio de la cita?"
        itemSummary={
          <Typography variant="body2">
            {estilista.toUpperCase()} — {servicio?.nombre || "Sin servicio"} (
            {hora} - {horaFin})
          </Typography>
        }
        onConfirm={handleRemove}
        confirmLabel="Quitar"
      />
    </Fragment>
  );
};

export default ServiciosForm;
