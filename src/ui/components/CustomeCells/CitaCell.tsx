import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
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
  },
  card: {
    height: "100%",
    width: "100%",
    borderRadius: 0,
    display: "flex",
    flexDirection: "row",
  },
  cardActionArea: {
    height: "100%",
    width: "100%",
    padding: "3px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 0.25,
  },
  detailRow: {
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 0.75,
  },
  nameRow: {
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 0.75,
  },
  bgCardColors: {
    "sin confirmar": {
      backgroundColor: "#F5F5F5",
      color: "#78909C",
    },
    confirmado: {
      backgroundColor: "#E3F2FD",
      color: "#1565C0",
    },
    "en proceso": {
      backgroundColor: "#FFF3E0",
      color: "#E65100",
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

  const nombreClienteColorValue =
    nombreClienteColor[estado as keyof Estados] || "#455A64";

  return (
    <Box sx={STYLES.mainContainer}>
      <Tooltip
        title={
          <Stack spacing={0.5} sx={{ p: 0.5 }}>
            <Typography variant="body2" fontWeight="bold">
              {toTitleString(value.nombreCliente)}
            </Typography>
            <Typography variant="body2">
              {`${servicio?.servicio.nombre} - $${servicio?.servicio.precio}`}
            </Typography>
            <Typography variant="body2">
              {`${servicio?.horaInicio} - ${servicio?.horaFin}`}
            </Typography>
          </Stack>
        }
        arrow
        placement="top"
      >
        <Card
          elevation={0}
          square
          sx={{
            ...STYLES.card,
            ...STYLES.bgCardColors[estado as keyof Estados],
          }}
        >
          <CardActionArea
            onClick={(e) => handleClick(e)}
            sx={STYLES.cardActionArea}
          >
            <Stack sx={STYLES.nameRow}>
              <Typography
                variant="body2"
                fontWeight="bold"
                component="span"
                noWrap
                color={nombreClienteColorValue}
                sx={{
                  minWidth: 0,
                  flexShrink: 1,
                  fontSize: "0.9rem",
                  lineHeight: 1.25,
                }}
              >
                {toTitleString(value.nombreCliente)}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                noWrap
                color={nombreClienteColorValue}
                sx={{
                  opacity: 0.8,
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  lineHeight: 1.25,
                }}
              >
                {value.telefonoCliente}
              </Typography>
            </Stack>
            <Stack sx={STYLES.detailRow}>
              <Typography
                variant="body2"
                component="span"
                noWrap
                color={nombreClienteColorValue}
                sx={{
                  opacity: 0.8,
                  minWidth: 0,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {servicio?.servicio.nombre || ""}
              </Typography>
              <Chip
                id="estadoChip"
                size="small"
                label={
                  value.estado.charAt(0).toUpperCase() + value.estado.slice(1)
                }
                onClick={handleChipClick}
                sx={{
                  ...STYLES.chipColor[value.estado as keyof Estados],
                  height: 20,
                  fontSize: "0.7rem",
                  flexShrink: 0,
                  "& .MuiChip-label": { padding: "0 8px" },
                }}
              />
            </Stack>
          </CardActionArea>
        </Card>
      </Tooltip>
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
