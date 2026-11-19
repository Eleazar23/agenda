import { Card, CardContent, CardHeader, Chip, Divider, Stack } from "@mui/material";
import ServiciosForm from "../forms/ServiciosForm";
import { useAgendaContext } from "../../contexts/AgendaContext";

const ServiciosCard = () => {
  const { cita } = useAgendaContext();
  const {servicios} = cita
  const subtotal = servicios.reduce(
    (total, servicio) => total + (servicio.servicio?.precio || 0),
    0,
  );
  return (
    <Card variant="outlined" sx={{ width: "100%", maxHeight: "100%"}}>
      <CardHeader
        title="Servicios"
        action={
          subtotal > 0 ? (
            <Chip
              label={`Subtotal: $${subtotal}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mr: 2, mt: 1 }}
            />
          ) : null
        }
      />
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
