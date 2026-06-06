import { Card, CardContent, CardHeader, Divider, Grid, Stack } from "@mui/material";
import ServiciosForm from "../forms/ServiciosForm";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { useEffect, useState } from "react";

type Servicio = {
  rowIndex: number | 0;
  estilista: string;
  servicio: string;
  hora: string;
};

type Props = {
  servicios: Array<Servicio>;
};

const ServiciosCard = () => {
  const { cita } = useAgendaContext();
  const {servicios} = cita
  return (
    <Card variant="outlined" sx={{ width: "100%", maxHeight: "100%"}}>
      <CardHeader title="Servicios" />
      <Divider />
      <CardContent sx={{maxHeight: "100%", overflowY: "auto" }}>
        <Stack gap={2} sx={{ width: "100%" }}>
          {servicios.map((servicio, index) => {
            return (
              <ServiciosForm
                key={`${servicio.cellID}-${servicio.estilista}`}
                cellID={servicio.cellID ?? ""}
                estilista={servicio.estilista}
                hora={servicio.horaInicio ?? ""}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiciosCard;
