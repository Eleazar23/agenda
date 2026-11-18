import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import ServiciosForm from "../forms/ServiciosForm";
import { useAgendaContext } from "../../contexts/AgendaContext";

const ServiciosCard = () => {
  const { cita } = useAgendaContext();
  const {servicios} = cita
  return (
    <Card variant="outlined" sx={{ width: "100%", maxHeight: "100%"}}>
      <CardHeader title="Servicios" />
      <Divider />
      <CardContent sx={{maxHeight: "100%", overflowY: "auto" }}>
        <Stack gap={2} sx={{ width: "100%" }}>
          {servicios.map((servicio) => {
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
