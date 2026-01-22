import { Card, CardContent, CardHeader, Divider, Grid } from "@mui/material";
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
    <Card variant="outlined">
      <CardHeader title="Servicios" />
      <Divider />
      <CardContent>
        <Grid container gap={2} sx={{ width: "100%" }}>
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ServiciosCard;
