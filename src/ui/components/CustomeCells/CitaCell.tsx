import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";
import CitaModal from "../modals/CitaModal";

const CitaCell = (params: CustomCellRendererProps) => {
  const { setIsCitaOpen } = useAgendaContext();
  const { value } = params;
  const { servicio } = value;

  const handleClick = () => {
    console.log("Opening modal for:", value);
    // setCita(value);
    setIsCitaOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Card sx={{ height: "100%", width: "100%", backgroundColor: "primary.main" }}>
        <CardActionArea onClick={handleClick} sx={{ height: "100%" }}>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "0.5rem",
            }}
          >
              <Typography variant="body1" fontWeight="bold" component="div" color="white">
                {value.nombreCliente}
              </Typography>
              <Typography variant="body1" component="div" color="white">
                {value.telefonoCliente}
              </Typography>
              <Typography variant="body2" color="white">
                {`${servicio?.servicio.nombre} - $${servicio?.servicio.precio} | ${servicio?.estado}` || ""}
              </Typography>
              {/* <Typography variant="body2" color="white">
                Tiempo: {servicio?.duracion} minutos
              </Typography> */}
            </CardContent>
          </CardActionArea>
        </Card>
        <CitaModal key={servicio?.id} cita={servicio} />
    </Box>
    )
}

export default CitaCell;