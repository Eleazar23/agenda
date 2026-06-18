import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
// import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";
import CitaModal from "../modals/CitaModal";
import { useState } from "react";

const CitaCell = (params: CustomCellRendererProps) => {
  // const { setIsCitaOpen } = useAgendaContext();
  const [isCitaOpen, setIsCitaOpen] = useState(false);
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
      <Card
        sx={{ height: "100%", width: "100%", backgroundColor: "#0D47A1" }}
      >
        <CardActionArea onClick={handleClick} sx={{ height: "100%" }}>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "0.5rem",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              component="div"
              color="white"
            >
              {value.nombreCliente}
            </Typography>
            <Typography variant="body1" component="div" color="#90CAF9">
              {value.telefonoCliente}
            </Typography>
            <Typography variant="body2" color="#90CAF9">
              {`${servicio?.servicio.nombre} - $${servicio?.servicio.precio} | ${(value?.estado).charAt(0).toUpperCase() + (value?.estado).slice(1)}` ||
                ""}
            </Typography>
            {/* <Typography variant="body2" color="white">
                Tiempo: {servicio?.duracion} minutos
              </Typography> */}
          </CardContent>
        </CardActionArea>
      </Card>
      <CitaModal
        key={servicio?.id}
        fecha={value.fecha}
        nombreCliente={value.nombreCliente}
        telefonoCliente={value.telefonoCliente}
        servicio={servicio}
        estado={value.estado}
        isCitaOpen={isCitaOpen}
        setIsCitaOpen={setIsCitaOpen}
      />
    </Box>
  );
};

export default CitaCell;
