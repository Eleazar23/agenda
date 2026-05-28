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
  const {
    cita,
    setCita,
    searchClienteByPhone,
    handleAlert,
    addCliente,
  } = useAgendaContext();
  const [isNewCliente, setIsNewCliente] = useState(false);
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);


  const updateCitaCliente = (nombre: string, telefono: string) => {
    setCita((prev) => ({
      ...prev,
      nombreCliente: nombre,
      telefonoCliente: telefono,
    }));
  };

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

  const searchByPhone = async (telefono: string) => {
    const cliente = await searchClienteByPhone(telefono);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      updateCitaCliente(cliente.nombre, cliente.telefono);
      return;
    }
    setIsNewCliente(() => true);
    handleAlert("Cliente no encontrado", "error");
  };

  const handleGuardarNuevoCliente = () => {
    if (!cita.nombreCliente || !cita.telefonoCliente) {
      handleAlert("Nombre y teléfono son obligatorios", "error");
      return;
    }
    addCliente({
      nombre: cita.nombreCliente,
      telefono: cita.telefonoCliente,
      correo: "",
      lastVisit: "",
    } as any);
    setIsNewCliente(false);
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
                updateCitaCliente(cliente.nombre, cliente.telefono)
              }
              ctxOptions={allClientes}
            />
            <PhoneInput
              valueContext={cita.telefonoCliente}
              dispatchContext={dispatchPhone}
              handleSearch={searchByPhone}
            />
            {isNewCliente && (
              <Box
                component="div"
                display={"flex"}
                sx={{ width: "100%" }}
                justifyContent={"flex-end"}
              >
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
