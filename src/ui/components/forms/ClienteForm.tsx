import { useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import PhoneInput from "../Inputs/PhoneInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import ClienteInput from "../Inputs/ClienteInput";
import { Cliente } from "../../types/Cliente";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import ClienteOption from "../buttons/ClienteOption";

const ClienteForm = () => {
  const {
    cita,
    setCita,
    searchClienteByPhone,
    searchClientesByNombre,
    handleAlert,
    addCliente,
  } = useAgendaContext();
  const [isNewCliente, setIsNewCliente] = useState(false);
  const [clientesOptions, setClientesOptions] = useState<Cliente[] | []>([]);
  const [isOpenClienteOptions, setIsOpenClienteOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const { cita } = agendaData;

  const updateCitaCliente = (nombre: string, telefono: string) => {
    setCita(prev => ({
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

  const searchByNombre = async (event: React.MouseEvent<HTMLButtonElement>,nombre: string) => {
    // Implement search logic here
    // const cliente = await searchClienteByNombre(nombre);
    setAnchorEl(event.currentTarget);
    const clientes = await searchClientesByNombre(nombre);
    if (clientes &&clientes.length > 0) {
      setClientesOptions(() => clientes);
      setIsOpenClienteOptions(() => true);
      setIsOpenClienteOptions(() =>true);
      console.log("Clientes encontrados:", clientes);
      // handleAlert("Cliente encontrado", "success");
      // setCita((prevCita) => ({
      //   ...prevCita,
      //   nombreCliente: cliente.nombre,
      //   telefonoCliente: cliente.telefono,
      // }));
      setIsNewCliente(() => false);
      return;
    }
    setIsNewCliente(() => true);
    handleAlert("Cliente no encontrado", "error");
  };

  const handleClickSearchNombre = (
    event: React.MouseEvent<HTMLButtonElement>,
    nombre: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setIsOpenClienteOptions(true);
  };

  const searchByPhone = async (telefono: string) => {
    // Implement search logic here
    const cliente = await searchClienteByPhone(telefono);
    if (cliente) {
      handleAlert("Cliente encontrado", "success");
      updateCitaCliente(cliente.nombre, cliente.telefono);
      // setCita((prevCita) => ({
      //   ...prevCita,
      //   nombreCliente: cliente.nombre,
      //   telefonoCliente: cliente.telefono,
      // }));
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
      telefono: cita.telefonoCliente,
      correo: "",
      lastVisit: "",
    } as any);
    setIsNewCliente(false);
  };

  const handleClose = () => {
    setIsOpenClienteOptions(false);
    setAnchorEl(null);
  };

  const handleSelectClienteOption = (nombre:string, telefono: string) => {
    updateCitaCliente(nombre, telefono);
    setIsOpenClienteOptions(false);
    setAnchorEl(null);
  };

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
              handleSearch={searchByNombre}
              // options={clientesOptions}
            />
            <Popover
              id={"cliente-options-popover"}
              open={isOpenClienteOptions}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Stack gap={0}>
                {clientesOptions.map((cliente, i)=>{
                  return (
                    <ClienteOption
                    key={`option-${cliente.nombre}`}
                    nombre={cliente.nombre}
                    telefono={cliente.telefono}
                    ctxOnClick={()=> handleSelectClienteOption(cliente.nombre, cliente.telefono)}
                    />
                  )
                })}
              </Stack>
            </Popover>
            <PhoneInput
              valueContext={cita.telefonoCliente}
              dispatchContext={dispatchPhone}
              handleSearch={searchByPhone}
              autoFocus={true}
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
