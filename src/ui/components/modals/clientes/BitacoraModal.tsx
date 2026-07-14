import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  TextField,
  Button,
  Autocomplete,
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Cita } from "../../../types/Cita";
import { Cliente } from "../../../types/Cliente";
import { getCurrentDate } from "../../../utils/utils";

interface BitacoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
}

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

type EstadoColor =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

const getEstadoColor = (estado: string): EstadoColor => {
  const estadoMap: { [key: string]: EstadoColor } = {
    completada: "success",
    pagado: "success",
    finalizado: "success",
    confirmada: "info",
    pendiente: "warning",
    "no asistio": "error",
    cancelado: "error",
    "sin confirmar": "warning",
  };
  return estadoMap[estado?.toLowerCase()] || "default";
};

function CitaCard({ cita }: { cita: Cita }) {
  const [expanded, setExpanded] = useState(false);

  const servicios = cita.servicios || [];
  const isSingle = servicios.length === 1;
  const sameStylist =
    servicios.length > 0 &&
    servicios.every((s) => s.estilista === servicios[0].estilista);
  const hasDetail = !isSingle || !!cita.metodoDePago || !!cita.notas;

  const color = getEstadoColor(cita.estado);
  const borderColor = color !== "default" ? `${color}.main` : "grey.400";

  const summaryLabel =
    servicios.length > 1
      ? `${servicios[0].servicio?.nombre} + ${servicios.length - 1} más`
      : (servicios[0]?.servicio?.nombre ?? "");

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderLeft: 3, borderLeftColor: borderColor }}
    >
      <CardContent
        onClick={hasDetail ? () => setExpanded((v) => !v) : undefined}
        sx={hasDetail ? { cursor: "pointer" } : undefined}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: "text.secondary" }}
            >
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="body2" color="text.secondary">
                {cita.fecha}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.disabled" mt={0.25}>
              {summaryLabel}
              {sameStylist && servicios[0]?.estilista
                ? ` · ${servicios[0].estilista}`
                : ""}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={cita.estado}
              color={color}
              size="small"
              sx={{ textTransform: "capitalize" }}
            />
            {hasDetail && (
              <IconButton
                size="small"
                aria-label="Ver detalle"
                aria-expanded={expanded}
                tabIndex={-1}
                sx={{
                  pointerEvents: "none",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {hasDetail && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box mt={1.5}>
              {sameStylist ? (
                <List disablePadding>
                  {servicios.map((s, i) => (
                    <ListItem
                      key={s.cellID || i}
                      disablePadding
                      sx={{
                        py: 0.75,
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: i < servicios.length - 1 ? 1 : 0,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {s.servicio?.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.horaInicio} - {s.horaFin}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List disablePadding>
                  {servicios.map((s, i) => (
                    <ListItem
                      key={s.cellID || i}
                      disablePadding
                      sx={{
                        py: 1,
                        borderBottom: i < servicios.length - 1 ? 1 : 0,
                        borderColor: "divider",
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar
                          sx={{
                            width: 26,
                            height: 26,
                            fontSize: 11,
                            bgcolor: "primary.light",
                          }}
                        >
                          {s.estilista?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={s.servicio?.nombre}
                        secondary={`${s.horaInicio} - ${s.horaFin} · ${s.estilista}`}
                        slotProps={{
                          primary: { fontSize: 14, fontWeight: 500 },
                          secondary: { fontSize: 12 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {cita.metodoDePago && (
                <>
                  <Divider sx={{ mt: 1 }} />
                  <Typography variant="body2" color="text.secondary" pt={1.5}>
                    Método de pago:{" "}
                    <Box component="span" fontWeight={600} color="text.primary">
                      {cita.metodoDePago}
                    </Box>
                  </Typography>
                </>
              )}

              {cita.notas && (
                <>
                  <Divider sx={{ mt: 1.5 }} />
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    display="block"
                    pt={1.5}
                  >
                    Notas
                  </Typography>
                  <Typography variant="body2" pt={0.5}>
                    {cita.notas}
                  </Typography>
                </>
              )}
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}

export default function BitacoraModal({
  isOpen,
  onClose,
  cliente,
}: BitacoraModalProps) {
  const today = getCurrentDate().formattedDate;

  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState<string | null>(today);
  const [estilistaFiltro, setEstilistaFiltro] = useState<string | null>(null);
  const [servicioFiltro, setServicioFiltro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cliente) {
      loadClienteHistory();
      setFechaFiltro(today);
      setEstilistaFiltro(null);
      setServicioFiltro(null);
    }
  }, [isOpen, cliente]);

  const loadClienteHistory = async () => {
    try {
      setLoading(true);
      const clienteCitas: Cita[] = await window.api.getCitasByCliente(
        cliente.nombre,
        cliente.telefono,
      );

      const sortedCitas = [...clienteCitas].sort(
        (a, b) => parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime(),
      );

      setCitas(sortedCitas);
    } catch (error) {
      console.error("Error loading cliente history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fechasDisponibles = useMemo(() => {
    const set = new Set<string>([today]);
    citas.forEach((cita) => {
      if (cita.fecha) set.add(cita.fecha);
    });
    return Array.from(set).sort(
      (a, b) => parseDate(b).getTime() - parseDate(a).getTime(),
    );
  }, [citas, today]);

  const estilistasDisponibles = useMemo(() => {
    const set = new Set<string>();
    citas.forEach((cita) =>
      (cita.servicios || []).forEach((serv) => {
        if (serv.estilista) set.add(serv.estilista);
      }),
    );
    return Array.from(set).sort();
  }, [citas]);

  const serviciosDisponibles = useMemo(() => {
    const set = new Set<string>();
    citas.forEach((cita) =>
      (cita.servicios || []).forEach((serv) => {
        if (serv.servicio?.nombre) set.add(serv.servicio.nombre);
      }),
    );
    return Array.from(set).sort();
  }, [citas]);

  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      if (fechaFiltro && cita.fecha !== fechaFiltro) {
        return false;
      }
      if (
        estilistaFiltro &&
        !(cita.servicios || []).some(
          (serv) => serv.estilista === estilistaFiltro,
        )
      ) {
        return false;
      }
      if (
        servicioFiltro &&
        !(cita.servicios || []).some(
          (serv) => serv.servicio?.nombre === servicioFiltro,
        )
      ) {
        return false;
      }
      return true;
    });
  }, [citas, fechaFiltro, estilistaFiltro, servicioFiltro]);

  const handleClearFiltros = () => {
    setFechaFiltro(today);
    setEstilistaFiltro(null);
    setServicioFiltro(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            minHeight: "70vh",
            maxHeight: "85vh",
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              Historial de Visitas
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {cliente?.nombre} - {cliente?.telefono}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <Box sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Autocomplete
            options={fechasDisponibles}
            value={fechaFiltro}
            onChange={(_e, newValue) => setFechaFiltro(newValue)}
            size="small"
            sx={{ minWidth: 170 }}
            renderInput={(params) => <TextField {...params} label="Fecha" />}
          />
          <Autocomplete
            options={estilistasDisponibles}
            value={estilistaFiltro}
            onChange={(_e, newValue) => setEstilistaFiltro(newValue)}
            size="small"
            sx={{ minWidth: 170 }}
            renderInput={(params) => (
              <TextField {...params} label="Estilista" />
            )}
          />
          <Autocomplete
            options={serviciosDisponibles}
            value={servicioFiltro}
            onChange={(_e, newValue) => setServicioFiltro(newValue)}
            size="small"
            sx={{ minWidth: 170 }}
            renderInput={(params) => <TextField {...params} label="Servicio" />}
          />
          {(fechaFiltro !== today || estilistaFiltro || servicioFiltro) && (
            <Button size="small" onClick={handleClearFiltros}>
              Limpiar filtros
            </Button>
          )}
        </Stack>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : citasFiltradas.length === 0 ? (
          <Box textAlign="center" py={8}>
            <CalendarMonthIcon
              sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No hay historial de visitas
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              {citas.length === 0
                ? "Este cliente aún no tiene citas registradas"
                : "No hay citas que coincidan con los filtros seleccionados"}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {citasFiltradas.map((cita, index) => (
              <CitaCard key={cita.id || index} cita={cita} />
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
