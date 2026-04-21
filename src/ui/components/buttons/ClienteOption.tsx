import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import React from "react";

const mockCliente = {
  id: 2,
  nombre: "eleazar celis",
  telefono: "3123443434",
  correo: "",
  lastVisit: "12-04-2026",
};

interface ClienteOption {
  nombre: string;
  telefono: string;
}

interface Props {
  nombre: string;
  telefono: string;
  key: number | string;
  ctxOnClick: ({ nombre, telefono }: ClienteOption) => void;
}

function ClienteOption({ nombre, telefono, key, ctxOnClick }: Props) {
  function handleOnClick(
    e: React.MouseEvent<HTMLButtonElement>,
    nombre: string,
    telefono: string,
  ) {
    console.log({ nombre, telefono });
    ctxOnClick({nombre, telefono});
  }

  return (
    <ButtonBase key={key} onClick={(e) => handleOnClick(e, nombre, telefono)}>
      <Box component={"div"} sx={{ p: 1, border: "1px solid grey" }}>
        <Stack alignItems={"flex-start"} gap={1}>
          <Typography variant="h6">{nombre}</Typography>
          <Typography variant="caption">{telefono}</Typography>
        </Stack>
      </Box>
    </ButtonBase>
  );
}

export default ClienteOption;
