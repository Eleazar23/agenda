import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";
import CitaModal from "../modals/CitaModal";
import React, { useState } from "react";
import { toTitleString } from "../../utils/utils";
import { statusOptions } from "../../constants/statusOptions";

interface Estados {
  "sin confirmar": string;
  confirmado: string;
  "en proceso": string;
  pagado: string;
  finalizado: string;
  "no asistio": string;
}

const STYLES = {
  mainContainer: {
    width: "100%",
    height: "100%",
    padding: "4px",
  },
  card: {
    height: "100%",
    width: "100%",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 1,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    padding: 0,
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 0,
  },
  bgCardColors: {
    "sin confirmar": {
      backgroundColor: "#F5F5F5",
      color: "#78909C",
      border: "1px solid #CFD8DC",
    },
    confirmado: {
      backgroundColor: "#E3F2FD",
      color: "#1565C0",
      border: "1px solid #90CAF9",
    },
    "en proceso": {
      backgroundColor: "#FFF3E0",
      color: "#E65100",
      border: "1px solid #FFCC80",
    },
    pagado: { backgroundColor: "#0D47A1", color: "#90CAF9" },
    finalizado: { backgroundColor: "#1B5E20", color: "#A5D6A7" },
    "no asistio": { backgroundColor: "#37474F", color: "#90A4AE" },
  },
  chipColor: {
    "sin confirmar": { backgroundColor: "#ECEFF1", color: "#546E7A" },
    confirmado: { backgroundColor: "#BBDEFB", color: "#0D47A1" },
    "en proceso": { backgroundColor: "#FFE0B2", color: "#BF360C" },
    pagado: { backgroundColor: "#1565C0", color: "#E3F2FD" },
    finalizado: { backgroundColor: "#2E7D32", color: "#E8F5E9" },
    "no asistio": { backgroundColor: "#546E7A", color: "#ECEFF1" },
  },
};

const nombreClienteColor: Estados = {
  "sin confirmar": "#455A64",
  confirmado: "#0D47A1",
  "en proceso": "#BF360C",
  pagado: "#FFFFFF",
  finalizado: "#FFFFFF",
  "no asistio": "#FFFFFF",
};

const CitaCell = (params: CustomCellRendererProps) => {
  const { citas, handleEditCita } = useAgendaContext();
  const [isCitaOpen, setIsCitaOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);
  const { value } = params;
  const { servicio, estado } = value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Opening modal for:", value);
    setIsCitaOpen(true);
  };

  const handleChipClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isUpdatingEstado) return;
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEstadoSelect = async (
    e: React.MouseEvent<HTMLLIElement>,
    nuevoEstado: string,
  ) => {
    e.stopPropagation();
    setAnchorEl(null);
    if (nuevoEstado === estado || isUpdatingEstado) return;

    const citaCompleta = citas.find(
      (c) => c.clienteId === value.clienteId && c.fecha === value.fecha,
    );
    if (!citaCompleta) return;

    setIsUpdatingEstado(true);
    try {
      await handleEditCita(
        citaCompleta.id,
        { ...citaCompleta, estado: nuevoEstado },
        [],
      );
    } finally {
      setIsUpdatingEstado(false);
    }
  };

  return (
    <Box sx={STYLES.mainContainer}>
      <Card
        sx={{
          ...STYLES.card,
          ...STYLES.bgCardColors[estado as keyof Estados],
        }}
      >
        <CardActionArea onClick={(e) => handleClick(e)}>
          <CardContent sx={STYLES.cardContent}>
            <Typography
              variant="body1"
              fontWeight="bold"
              component="div"
              color={nombreClienteColor[estado as keyof Estados] || "#455A64"}
            >
              {toTitleString(value.nombreCliente)}
            </Typography>
            {/* <Typography variant="body1" component="div" color="#90CAF9"> */}
            <Typography variant="body1" component="div">
              {value.telefonoCliente}
            </Typography>
            <Typography variant="body2">
              {`${servicio?.servicio.nombre} - $${servicio?.servicio.precio}` ||
                ""}
            </Typography>
          </CardContent>
          {/* </CardActionArea> */}
          <CardActions sx={STYLES.cardActions}>
            <Chip
              id="estadoChip"
              label={
                value.estado.charAt(0).toUpperCase() + (value?.estado).slice(1)
              }
              onClick={handleChipClick}
              sx={STYLES.chipColor[value.estado as keyof Estados]}
            />
          </CardActions>
        </CardActionArea>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.value === value.estado}
            onClick={(e) => handleEstadoSelect(e, option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <CitaModal
        key={servicio?.id}
        fecha={value.fecha}
        clienteId={value.clienteId}
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

export default React.memo(
  CitaCell,
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);
