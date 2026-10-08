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
import { darken, useTheme } from "@mui/material/styles";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";
import CitaModal from "../modals/CitaModal";
import React, { useState } from "react";
import { toTitleString } from "../../utils/utils";
import { statusOptions } from "../../constants/statusOptions";
import type { CitaStatusKey } from "../../theme/theme";

const STYLES = {
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  card: {
    height: "calc(100% - 2px)",
    width: "calc(100% - 4px)",
    margin: "1px 2px",
    borderRadius: "4px",
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
};

const CitaCell = (params: CustomCellRendererProps) => {
  const { citas, handleEditCita } = useAgendaContext();
  const theme = useTheme();
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

  const colors =
    theme.palette.agenda.citas[estado as CitaStatusKey] ||
    theme.palette.agenda.citas["sin confirmar"];
  const isPagado = estado === "pagado";
  const isNoAsistio = estado === "no asistio";
  // "Pagado" es el único estado con relleno sólido; para los demás se
  // oscurece ~5% con darken(). Para pagado se usa el tono definido a mano.
  const hoverBg = isPagado ? "#276B2B" : darken(colors.bg, 0.05);
  const chipLabel = isPagado
    ? "✓ Pagado"
    : value.estado.charAt(0).toUpperCase() + value.estado.slice(1);

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
          sx={{
            ...STYLES.card,
            backgroundColor: colors.bg,
            borderLeft: `4px solid ${colors.border}`,
          }}
        >
          <CardActionArea
            onClick={(e) => handleClick(e)}
            sx={{
              ...STYLES.cardActionArea,
              "&:hover": { backgroundColor: hoverBg },
            }}
          >
            <Stack sx={STYLES.nameRow}>
              <Typography
                variant="body2"
                fontWeight={500}
                component="span"
                noWrap
                color={colors.name}
                sx={{
                  minWidth: 0,
                  flexShrink: 1,
                  fontSize: "0.9rem",
                  lineHeight: 1.25,
                  textDecoration: isNoAsistio ? "line-through" : "none",
                }}
              >
                {toTitleString(value.nombreCliente)}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                noWrap
                color={colors.text}
                sx={{
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
                color={colors.text}
                sx={{
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
                label={chipLabel}
                onClick={handleChipClick}
                sx={{
                  backgroundColor: colors.chipBg,
                  color: colors.chipText,
                  borderRadius: "999px",
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
