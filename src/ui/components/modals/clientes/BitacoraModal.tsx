import { useEffect, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Cita } from "../../../types/Cita";
import { Cliente } from "../../../types/Cliente";

interface BitacoraModalProps {
  open: boolean;
  onClose: () => void;
  cliente: Cliente;
}

export default function BitacoraModal({
  open,
  onClose,
  cliente,
}: BitacoraModalProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCitas, setTotalCitas] = useState({
    completadas: 0,
    sinAsistir: 0,
    canceladas: 0,
  });

  useEffect(() => {
    if (open && cliente) {
      loadClienteHistory();
    }
  }, [open, cliente]);

  const loadClienteHistory = async () => {
    try {
      setLoading(true);
      // Get all citas from MongoDB
      const allCitas = await window.api.getCitas();

      // Filter citas for this specific client by phone (unique identifier)
      const clienteCitas = allCitas.filter(
        (cita: Cita) => cita.telefonoCliente === cliente.phone,
      );

      // Sort by date (most recent first)
      const sortedCitas = clienteCitas.sort((a: Cita, b: Cita) => {
        // Convert DD-MM-YYYY to comparable format
        const parseDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split("-");
          return new Date(`${year}-${month}-${day}`);
        };
        return parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime();
      });

      setCitas(sortedCitas);
    } catch (error) {
      console.error("Error loading cliente history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const estadoMap: {
      [key: string]: "success" | "warning" | "error" | "info" | "default";
    } = {
      completada: "success",
      pagado: "success",
      finalizado: "success",
      confirmada: "info",
      pendiente: "warning",
      "no asistio": "error",
      cancelado: "error",
      "sin confirmar": "warning",
    };
    return estadoMap[estado.toLowerCase()] || "default";
  };

  const getTotalServicios = () => {
    const totals = citas.reduce(
      (acc, cita) => {
        const estado = cita.estado.toLowerCase();
        if (
          estado === "completada" ||
          estado === "pagado" ||
          estado === "finalizado"
        ) {
          acc.completadas += 1;
        }
        if (estado === "no asistio") {
          acc.sinAsistir += 1;
        }
        if (estado === "cancelado") {
          acc.canceladas += 1;
        }
        return acc;
      },
      { completadas: 0, sinAsistir: 0, canceladas: 0 },
    );
    setTotalCitas((prev) => ({ ...prev, ...totals }));
    return totals.completadas;
  };

  const getTotalGastado = () => {
    return citas
      .filter((cita) => cita.estado.toLowerCase() === "completada")
      .reduce((total, cita) => {
        const precio = parseFloat(cita.servicio.precio) || 0;
        return total + precio;
      }, 0);
  };

  useEffect(() => {
    getTotalServicios();
  }, [citas]);

  return (
    <Dialog
      open={open}
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
              {cliente.nombre} - {cliente.phone}
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

      {/* Summary Stats */}
      <Box sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalCitas.sinAsistir}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Visitas Sin Asistir
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalCitas.canceladas}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Visitas Canceladas
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalCitas.completadas}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Visitas Completadas
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box textAlign="center">
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {citas.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Citas
            </Typography>
          </Box>
          {/* <Divider orientation="vertical" flexItem />
          <Box textAlign="center">
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {citas.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Citas
            </Typography>
          </Box> */}
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
        ) : citas.length === 0 ? (
          <Box textAlign="center" py={8}>
            <CalendarMonthIcon
              sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No hay historial de visitas
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Este cliente aún no tiene citas registradas
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {citas.map((cita, index) => (
              <Card
                key={cita.id || index}
                variant="outlined"
                sx={{
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 2,
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="h6" component="div" fontWeight="600">
                        {cita.servicio.nombre}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        mt={1}
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Chip
                          icon={<CalendarMonthIcon />}
                          label={cita.fecha}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={`${cita.horaInicio} - ${cita.horaFin}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<PersonIcon />}
                          label={cita.estilista}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Stack>
                    </Box>
                    <Box textAlign="right">
                      <Chip
                        label={cita.estado}
                        color={getEstadoColor(cita.estado)}
                        size="small"
                        sx={{ mb: 1, textTransform: "capitalize" }}
                      />
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        <AttachMoneyIcon
                          sx={{ fontSize: 18, verticalAlign: "middle" }}
                        />
                        {cita.servicio.precio || "0.00"}
                      </Typography>
                    </Box>
                  </Box>

                  {cita.metodoDePago && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        Método de Pago:{" "}
                        <Typography
                          component="span"
                          variant="caption"
                          fontWeight="600"
                        >
                          {cita.metodoDePago}
                        </Typography>
                      </Typography>
                    </Box>
                  )}

                  {cita.notas && (
                    <Box
                      mt={1}
                      p={1.5}
                      bgcolor="background.default"
                      borderRadius={1}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Notas:
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {cita.notas}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
