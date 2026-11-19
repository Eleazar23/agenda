import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ReportesTable from "../tables/ReportesTable";
import FechaInput from "../Inputs/FechaInput";
import { Cita, Propina } from "../../types/Cita";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";
import EstilistaFilter from "../Inputs/EstilistaFilter";
import {
  capitalizeFirstLetter,
  fechaSortKey,
  getCurrentDate,
  getReporteRango,
  REPORTE_MAX_DIAS,
  ReportePeriodo,
} from "../../utils/utils";
import { Gasto } from "../../types/Gasto";

import { styled } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";

type ServicioInReporte = ServicioAgendado & {
  nombreCliente: string;
  metodoDePago: string;
};

type ProductoInReporte = ProductoInCita & {
  nombreCliente: string;
  fecha: string;
};

type PropinaInReporte = Propina & {
  nombreCliente: string;
  fecha: string;
};

const styles = {
  clientesContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    maxHeight: "100vh",
    flexWrap: "nowrap",
  },
  paper: {
    padding: 2,
    width: "100%",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    columnGap: 4,
    rowGap: 2,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    gap: 4,
  },
  tableContainer: {
    height: "100%",
  },
};

type ViewType = "servicios" | "productos" | "total" | "gastos" | "propinas";

// Orden cronológico (fecha DD-MM-YYYY y, si existe, hora de inicio) para
// que en Semana/Mes la tabla y el Excel salgan agrupados por día.
const byFecha = <T extends { fecha?: string; horaInicio?: string }>(
  a: T,
  b: T,
) =>
  fechaSortKey(a.fecha || "").localeCompare(fechaSortKey(b.fecha || "")) ||
  (a.horaInicio || "").localeCompare(b.horaInicio || "");

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: "2rem",
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
    },
}));

const Reportes = () => {
  const [servicios, setServicios] = useState<ServicioInReporte[]>([]);
  const [productos, setProductos] = useState<ProductoInReporte[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [propinas, setPropinas] = useState<PropinaInReporte[]>([]);
  const [estilistaFilter, setEstilistaFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState(getCurrentDate().formattedDate);
  const [fechaFin, setFechaFin] = useState(getCurrentDate().formattedDate);
  const [periodo, setPeriodo] = useState<ReportePeriodo>("dia");
  const [download, setDownload] = useState(false);
  const [view, setView] = useState<ViewType>("servicios");
  const [isLoading, setIsLoading] = useState(false);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType,
  ) => {
    if (newView !== null) {
      setView(newView);
      return;
    }
  };

  const handlePeriodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodo(event.target.value as ReportePeriodo);
  };

  // En Día solo cuenta la fecha de inicio; en Semana/Mes el rango lo eligen
  // los dos inputs y los botones solo validan su longitud máxima.
  const rango = useMemo(
    () =>
      getReporteRango(fechaFilter, periodo === "dia" ? fechaFilter : fechaFin),
    [fechaFilter, fechaFin, periodo],
  );

  const rangoError = useMemo(() => {
    if (periodo === "dia") return "";
    if (rango.fechas.length === 0) {
      return "Debe ser igual o posterior a la fecha de inicio";
    }
    const max = REPORTE_MAX_DIAS[periodo];
    if (rango.fechas.length > max) {
      return `Máximo ${max} días para el reporte ${periodo === "semana" ? "semanal" : "mensual"} (${rango.fechas.length} seleccionados)`;
    }
    return "";
  }, [periodo, rango]);

  const handleFechaFinChange = (inputName: string, fecha: string) => {
    setFechaFin(() => fecha);
  };

  const handleEstilistaChange = (inputName: string, estilista: string) => {
    // Lógica para filtrar los reportes por estilista
    if (estilista === "todos") {
      setEstilistaFilter("");
      return;
    }
    setEstilistaFilter(() => estilista);
  };

  const handleFechaChange = (inputName: string, fecha: string) => {
    // Lógica para filtrar los reportes por fecha
    setFechaFilter(() => fecha);
  };

  const handleDownload = () => {
    // Lógica para descargar el reporte en Excel
    setDownload(true);
  };

  const getServiciosProductosFromCitas = (citas: Cita[]) => {
    // La fecha de la cita es la que se consultó; se usa para todas las
    // filas para que el rango y el orden coincidan con la consulta.
    setServicios(
      citas
        .flatMap((cita) =>
          cita.servicios.map((servicio) => ({
            ...servicio,
            fecha: cita.fecha,
            nombreCliente: cita.nombreCliente,
            metodoDePago: cita.metodoDePago,
          })),
        )
        .sort(byFecha),
    );
    setProductos(
      citas
        .flatMap((cita) =>
          (cita.productos || []).map((producto) => ({
            ...producto,
            nombreCliente: cita.nombreCliente,
            fecha: cita.fecha,
          })),
        )
        .sort(byFecha),
    );
    setPropinas(
      citas
        .flatMap((cita) =>
          (cita.propinas || []).map((propina) => ({
            ...propina,
            nombreCliente: cita.nombreCliente,
            fecha: cita.fecha,
          })),
        )
        .sort(byFecha),
    );
  };

  const serviciosFiltred = useMemo(() => {
    if (estilistaFilter) {
      return servicios.filter(
        (servicio) => servicio.estilista === estilistaFilter,
      );
    }
    return servicios;
  }, [estilistaFilter, servicios]);

  const productosFiltred = useMemo(() => {
    if (estilistaFilter) {
      return productos.filter(
        (producto) => producto.estilista === estilistaFilter,
      );
    }
    return productos;
  }, [estilistaFilter, productos]);

  const propinasFiltred = useMemo(() => {
    if (estilistaFilter) {
      return propinas.filter(
        (propina) => propina.estilista === estilistaFilter,
      );
    }
    return propinas;
  }, [estilistaFilter, propinas]);

  const totalServicios = useMemo(() => {
    return serviciosFiltred.reduce((acumulador, servicio) => {
      return acumulador + Number(servicio.servicio.precio);
    }, 0);
  }, [serviciosFiltred]); // Se recalcula cuando 'cita?.servicios' cambia

  const totalProductos = useMemo(() => {
    return productosFiltred.reduce((acumulador, producto) => {
      return acumulador + Number(producto.precio) * Number(producto.cantidad);
    }, 0);
  }, [productosFiltred]);

  const totalGastos = useMemo(() => {
    return gastos.reduce((acumulador, gasto) => {
      return acumulador + Number(gasto.monto);
    }, 0);
  }, [gastos]);

  const totalPropinas = useMemo(() => {
    return propinasFiltred.reduce((acumulador, propina) => {
      return acumulador + Number(propina.monto);
    }, 0);
  }, [propinasFiltred]);

  // Lo que se le paga a cada estilista al cierre del día.
  const propinasPorEstilista = useMemo(() => {
    const acc = new Map<string, number>();
    propinasFiltred.forEach((propina) => {
      acc.set(
        propina.estilista,
        (acc.get(propina.estilista) || 0) + Number(propina.monto),
      );
    });
    return [...acc.entries()];
  }, [propinasFiltred]);

  const totalGeneral = useMemo(() => {
    return totalServicios + totalProductos;
  }, [totalServicios, totalProductos]);

  const currentViewData = useMemo(() => {
    switch (view) {
      case "servicios":
        return serviciosFiltred;
      case "productos":
        return productosFiltred;
      case "gastos":
        return gastos;
      case "propinas":
        return propinasFiltred;
      default:
        return serviciosFiltred;
    }
  }, [view, serviciosFiltred, productosFiltred, gastos, propinasFiltred]);

  useEffect(() => {
    if (!fechaFilter) {
      return;
    }
    if (rangoError || rango.fechas.length === 0) {
      // Rango inválido: no se consulta y se limpia para no mostrar totales
      // de un rango anterior.
      setServicios([]);
      setProductos([]);
      setPropinas([]);
      setGastos([]);
      return;
    }
    // Evita que una respuesta lenta de un rango anterior pise la actual.
    let cancelado = false;
    // Lógica para obtener los datos de los reportes
    const loadReportes = async () => {
      setIsLoading(true);
      try {
        const [citasFromDB, gastosFromDB] = await Promise.all([
          window.api.getCitasByFechas(rango.fechas),
          window.api.getGastosByFechas(rango.fechas),
        ]);
        if (cancelado) return;
        const citasPagadas = citasFromDB.filter(
          (cita: Cita) => cita.estado === "pagado",
        );
        getServiciosProductosFromCitas(citasPagadas);
        setGastos([...gastosFromDB].sort(byFecha));
      } catch (error) {
        console.error("Error loading reportes:", error);
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    };
    loadReportes();
    return () => {
      cancelado = true;
    };
  }, [fechaFilter, rango, rangoError]);

  const rangoArchivo =
    rango.fechas.length > 1
      ? `${rango.fechas[0]}_a_${rango.fechas[rango.fechas.length - 1]}`
      : fechaFilter;

  return (
    // Data Grid will fill the size of the parent container
    <Grid
      container
      sx={styles.clientesContainer}
      direction={"column"}
      spacing={2}
    >
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.actionBar}>
            <Box
              component="div"
              display={"flex"}
              alignItems="flex-start"
              flexWrap="wrap"
              sx={{ gap: 2 }}
            >
              <Box component="div" sx={{ width: "200px" }}>
                <EstilistaFilter
                  ctxValue={estilistaFilter}
                  ctxDispatch={handleEstilistaChange}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box component="div">
                <FechaInput
                  ctxValue={fechaFilter}
                  ctxDispatch={handleFechaChange}
                  label={periodo === "dia" ? "Fecha" : "Fecha Inicio"}
                  variant="outlined"
                  size="small"
                />
              </Box>
              {periodo !== "dia" && (
                <Box component="div">
                  <FechaInput
                    ctxValue={fechaFin}
                    ctxDispatch={handleFechaFinChange}
                    name="fechaFin"
                    label="Fecha Fin"
                    variant="outlined"
                    size="small"
                    error={Boolean(rangoError)}
                  />
                </Box>
              )}
              <TextField
                select
                label="Tipo de reporte"
                variant="outlined"
                size="small"
                value={periodo}
                onChange={handlePeriodoChange}
                sx={{ width: "160px" }}
              >
                <MenuItem value="dia">Diario</MenuItem>
                <MenuItem value="semana">Semanal</MenuItem>
                <MenuItem value="mes">Mensual</MenuItem>
              </TextField>
            </Box>
            <Box
              component="div"
              display={"flex"}
              alignItems="center"
              sx={{ gap: 2, minHeight: 40, ml: "auto" }}
            >
              <Typography
                variant="body1"
                color={rangoError ? "error" : "text.secondary"}
                sx={{ whiteSpace: rangoError ? "normal" : "nowrap", maxWidth: 320 }}
              >
                {rangoError || rango.label}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                onClick={handleDownload}
                disabled={
                  isLoading || Boolean(rangoError) || currentViewData.length === 0
                }
              >
                Guardar Excel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid container size={12} justifyContent="center">
        <StyledToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="Platform"
        >
          {/* <ToggleButton value="servicios">Servicios</ToggleButton> */}
          <ToggleButton value="servicios">
            <Stack>
              <Typography variant="button" align="center">
                Servicios
              </Typography>
              <Typography variant="h5" align="center">
                {`$${totalServicios.toFixed(2)}`}
              </Typography>
            </Stack>
          </ToggleButton>
          <ToggleButton value="productos">
            <Stack>
              <Typography variant="button" align="center">
                Productos
              </Typography>
              <Typography
                variant="h5"
                align="center"
              >{`$${totalProductos.toFixed(2)}`}</Typography>
            </Stack>
          </ToggleButton>
          <ToggleButton value="gastos">
            <Stack>
              <Typography variant="button" align="center">
                Gastos
              </Typography>
              <Typography variant="h5" align="center">
                {`$${totalGastos.toFixed(2)}`}
              </Typography>
            </Stack>
          </ToggleButton>
          <ToggleButton value="propinas">
            <Stack>
              <Typography variant="button" align="center">
                Propinas
              </Typography>
              <Typography variant="h5" align="center">
                {`$${totalPropinas.toFixed(2)}`}
              </Typography>
            </Stack>
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Grid>
      {view === "propinas" && propinasPorEstilista.length > 0 && (
        <Grid container size={12} gap={1} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            {periodo === "dia" ? "A pagar hoy:" : "A pagar en el periodo:"}
          </Typography>
          {propinasPorEstilista.map(([estilista, monto]) => (
            <Chip
              key={estilista}
              color="secondary"
              variant="outlined"
              label={`${capitalizeFirstLetter(estilista)} $${monto.toFixed(2)}`}
            />
          ))}
        </Grid>
      )}
      <Grid container sx={styles.tableContainer} size={12}>
        {isLoading ? (
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 2,
              py: 6,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
              Cargando reporte...
            </Typography>
          </Box>
        ) : currentViewData.length === 0 ? (
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              py: 6,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {rangoError
                ? "Corrige el rango de fechas para ver el reporte."
                : "No hay datos para mostrar con los filtros seleccionados."}
            </Typography>
          </Box>
        ) : (
          <ReportesTable
            reportesData={currentViewData}
            download={download}
            setDownload={setDownload}
            currentDate={rangoArchivo}
            filtro={estilistaFilter}
            view={view}
          />
        )}
      </Grid>
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.footer}>
            <Typography variant="h5" color="secondary.main">{`Propinas: $${totalPropinas.toFixed(2)}`}</Typography>
            <Typography variant="h5">{`Gastos: $${totalGastos.toFixed(2)}`}</Typography>
            <Typography variant="h5">{`Total: $${totalGeneral.toFixed(2)}`}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Reportes;
