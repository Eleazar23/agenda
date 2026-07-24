import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";
import { Cliente } from "../../types/Cliente";

const ClienteForm = () => {
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
        <CardHeader title="Cliente" />
        <Divider sx={{ margin: "0 1rem" }} />
        <CardContent>
          <Grid container gap={1} sx={{ width: "100%" }}>
            <ClienteInput
              ctxValue={cita.nombreCliente}
              dispatchContext={dispatchCliente}
              autoFocus={true}
              onSelectCliente={(cliente) =>
                updateCitaCliente(cliente.nombre, cliente.telefono, cliente.id)
              }
              ctxOptions={allClientes}
            />
            <PhoneInput
              valueContext={cita.telefonoCliente}
              dispatchContext={dispatchPhone}
              onSelectCliente={(cliente) =>
                updateCitaCliente(cliente.nombre, cliente.telefono, cliente.id)
              }
              ctxOptions={allClientes}
            />
            <Box
              component="div"
              display={"flex"}
              sx={{ width: "100%" }}
              justifyContent={"flex-end"}
            >
              <Button
                variant="contained"
                onClick={handleGuardarNuevoCliente}
                disabled={!canGuardarNuevoCliente}
              >
                Guardar nuevo cliente
              </Button>
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClienteForm;
