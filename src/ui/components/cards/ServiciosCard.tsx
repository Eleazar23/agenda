import { Card, CardContent, CardHeader, Divider, Grid } from "@mui/material";
import ServiciosForm from "../forms/ServiciosForm";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { useEffect, useState } from "react";

type Servicio = {
  rowIndex: null | number;
  estilista: string;
  servicio: string;
  hora: string;
};

type Props = {
  servicios: Array<Servicio>;
};

const ServiciosCard = () => {
  const { agendaData } = useAgendaContext();
  const {cita} = agendaData
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
                key={`${servicio.rowIndex}-${servicio.estilista}`}
                serviceIndex={index}
                rowIndex={servicio.rowIndex}
                estilista={servicio.estilista}
                hora={servicio.hora}
              />
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ServiciosCard;
