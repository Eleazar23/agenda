import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";
import { Cliente } from "../../types/Cliente";

export const NOMBRE_CLIENTE_INPUT_ID = "nueva-cita-nombre-cliente";
export const TELEFONO_CLIENTE_INPUT_ID = "nueva-cita-telefono-cliente";

type Props = {
  showErrors?: boolean;
};

const ClienteForm = ({ showErrors }: Props) => {
  const { cita, setCita, handleAlert, addCliente } = useAgendaContext();
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);

  const updateCitaCliente = (nombre: string, telefono: string, clienteId: number) => {
    setCita((prev) => ({
      ...prev,
      nombreCliente: nombre,
      telefonoCliente: telefono,
      clienteId,
    }));
  };

  const dispatchCliente = (value: string) => {
    // Cualquier edición manual del nombre invalida la selección previa:
    // se requiere volver a seleccionar/crear el cliente antes de guardar.
    setCita((prevCita) => ({
      ...prevCita,
      nombreCliente: value,
      clienteId: 0,
    }));
  };

  const dispatchPhone = (value: string) => {
    // Igual que con el nombre: editar el teléfono a mano invalida la
    // selección previa hasta volver a elegir/crear el cliente.
    setCita((prevCita) => ({
      ...prevCita,
      telefonoCliente: value,
      clienteId: 0,
    }));
  };

  const isNombreValido = cita.nombreCliente.trim().length >= 3;
  const isTelefonoValido = /^\d{10,}$/.test(cita.telefonoCliente || "");
  const canGuardarNuevoCliente =
    isNombreValido && isTelefonoValido && !cita.clienteId;

  // Rojo solo tras un intento de Guardar fallido (showErrors), y solo
  // mientras el campo siga vacío: no se marca por estar "incompleto".
  const nombreVacio = showErrors && cita.nombreCliente.trim().length === 0;
  const telefonoVacio =
    showErrors && (cita.telefonoCliente || "").trim().length === 0;

  // Explica por qué el botón está deshabilitado en vez de dejarlo gris sin
  // contexto; null cuando ya hay un cliente vinculado (el botón no aplica).
  const guardarNuevoClienteHint = cita.clienteId
    ? null
    : !isNombreValido && !isTelefonoValido
      ? "Escribe el nombre (mínimo 3 caracteres) y el teléfono (10 dígitos) para guardar un cliente nuevo"
      : !isNombreValido
        ? "El nombre debe tener al menos 3 caracteres"
        : !isTelefonoValido
          ? "El teléfono debe tener 10 dígitos"
          : null;

  const handleGuardarNuevoCliente = async () => {
    if (!canGuardarNuevoCliente) {
      handleAlert("Nombre y teléfono son obligatorios", "error");
      return;
    }
    const newCliente = await addCliente({
      nombre: cita.nombreCliente,
      telefono: cita.telefonoCliente,
      correo: "",
      lastVisit: "",
    } as Cliente);
    if (newCliente) {
      updateCitaCliente(newCliente.nombre, newCliente.telefono, newCliente.id);
    }
  };

    useEffect(() => {
    const loadClientes = async () => {
      try {
        const clientes = await window.api.getClientes();
        setAllClientes(clientes || []);
        // setOptions(clientes || []);
      } catch (error) {
        console.error("Error preloading clientes:", error);
        setAllClientes([]);
        // setOptions([]);
      }
    };

    loadClientes();
  }, []);

  return (
    <Grid size={12}>
      <Card variant="outlined">
        <CardHeader
          avatar={<PersonIcon color="primary" fontSize="small" />}
          title="Cliente"
          titleTypographyProps={{ variant: "subtitle1" }}
          sx={{ py: 1 }}
          action={
            cita.clienteId ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Cliente existente"
                color="success"
                variant="outlined"
                size="small"
                sx={{ mr: 2, mt: 1 }}
              />
            ) : null
          }
        />
        <Divider sx={{ margin: "0 1rem" }} />
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Grid container gap={1} sx={{ width: "100%" }}>
            <ClienteInput
              id={NOMBRE_CLIENTE_INPUT_ID}
              ctxValue={cita.nombreCliente}
              dispatchContext={dispatchCliente}
              autoFocus={true}
              onSelectCliente={(cliente) =>
                updateCitaCliente(cliente.nombre, cliente.telefono, cliente.id)
              }
              ctxOptions={allClientes}
              size="small"
              error={nombreVacio}
              helperText={nombreVacio ? "Falta el nombre del cliente" : undefined}
            />
            <PhoneInput
              id={TELEFONO_CLIENTE_INPUT_ID}
              valueContext={cita.telefonoCliente}
              dispatchContext={dispatchPhone}
              onSelectCliente={(cliente) =>
                updateCitaCliente(cliente.nombre, cliente.telefono, cliente.id)
              }
              ctxOptions={allClientes}
              size="small"
              error={telefonoVacio}
              helperText={telefonoVacio ? "Falta el teléfono del cliente" : undefined}
            />
            {/* Solo aplica mientras no haya un cliente ya vinculado (ver chip
                "Cliente existente" en el header); si ya está vinculado, no
                hay nada que guardar y el botón solo ocuparía espacio. */}
            {!cita.clienteId && (
              <Box
                component="div"
                display={"flex"}
                flexDirection={"column"}
                alignItems={"flex-end"}
                gap={0.5}
                sx={{ width: "100%" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGuardarNuevoCliente}
                  disabled={!canGuardarNuevoCliente}
                >
                  Guardar nuevo cliente
                </Button>
                {guardarNuevoClienteHint && (
                  <Typography variant="caption" color="text.secondary">
                    {guardarNuevoClienteHint}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClienteForm;
