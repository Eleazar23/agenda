import { Card, CardContent, CardHeader, Chip, Divider, Stack } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ServiciosForm from "../forms/ServiciosForm";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { formatMoney } from "../../utils/utils";

type Props = {
  showErrors?: boolean;
};

const ServiciosCard = ({ showErrors }: Props) => {
  const { cita } = useAgendaContext();
  const {servicios} = cita
  const subtotal = servicios.reduce(
    (total, servicio) => total + (servicio.servicio?.precio || 0),
    0,
  );
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        avatar={<ContentCutIcon color="primary" fontSize="small" />}
        title="Servicios"
        titleTypographyProps={{ variant: "subtitle1" }}
        sx={{ py: 1 }}
        action={
          subtotal > 0 ? (
            <Chip
              label={`Subtotal: ${formatMoney(subtotal)}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mr: 2, mt: 1 }}
            />
          ) : null
        }
      />
      <Divider />
      <CardContent sx={{ flex: 1, minHeight: 0, overflowY: "auto", pb: 3 }}>
        <Stack gap={2} sx={{ width: "100%" }}>
          {servicios.map((servicio) => {
            return (
              <ServiciosForm
                key={`${servicio.cellID}-${servicio.estilista}`}
                cellID={servicio.cellID ?? ""}
                estilista={servicio.estilista}
                hora={servicio.horaInicio ?? ""}
                showErrors={showErrors}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiciosCard;
