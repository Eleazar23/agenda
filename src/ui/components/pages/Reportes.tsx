import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import ReportesTable from "../tables/ReportesTable";
import EstilistaInput from "../Inputs/EstilistaInput";
import FechaInput from "../Inputs/FechaInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Cita } from "../../types/Cita";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";
import EstilistaFilter from "../Inputs/EstilistaFilter";

type ServicioInReporte = ServicioAgendado & {
  nombreCliente: string;
  metodoDePago: string;
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
    width: "100%",
    gap: 4,
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

const Reportes = () => {
  // const { fecha } = useAgendaContext();
  const [allCitas, setAllCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<ServicioInReporte[]>([]);
  const [productos, setProductos] = useState<ProductoInCita[]>([]);
  const [reportesData, setReportesData] = useState<Cita[]>([]);
  const [estilistaFilter, setEstilistaFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [download, setDownload] = useState(false);
  const [view, setView] = useState<"servicios" | "productos">("servicios");
  console.log("Reportes Data:", reportesData);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "servicios" | "productos",
  ) => {
    if (newView !== null) {
      setView(newView);
      return;
    }
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
    if (citas.length > 1) {
      let allServicios: ServicioInReporte[] = [];
      let allProductos: ProductoInCita[] = [];

      citas.forEach((cita) => {
        const serviciosCita = cita.servicios.map((servicio) => ({
          ...servicio,
          nombreCliente: cita.nombreCliente,
          metodoDePago: cita.metodoDePago,
        }));
        const productosCita = cita.productos;
        allServicios = [...allServicios, ...serviciosCita];
        allProductos = [...allProductos, ...productosCita];
      });

      setServicios(() => allServicios);
      setProductos(() => allProductos);
    } else {
      const cita = citas[0];
      setServicios(
        () =>
          cita?.servicios.map((servicio) => ({
            ...servicio,
            nombreCliente: cita.nombreCliente,
            metodoDePago: cita.metodoDePago,
          })) || [],
      );
      setProductos(() => cita?.productos || []);
    }
  };

  // Load all citas from MongoDB on mount
  const getCitasByFecha = async (fecha: string) => {
    try {
      const allCitasFromDBByFecha = await window.api.getCitasByFecha(fecha);
      const citasPagadas = allCitasFromDBByFecha.filter(
        (cita: Cita) => cita.estado === "pagado",
      );
      setAllCitas(() => citasPagadas);
      getServiciosProductosFromCitas(citasPagadas);
    } catch (error) {
      console.error("Error loading all citas:", error);
    }
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

  useEffect(() => {
    // Lógica para obtener los datos de los reportes
    getCitasByFecha(fechaFilter);
    console.log({ servicios, productos });
  }, [fechaFilter]);

  return (
    // Data Grid will fill the size of the parent container
    <Grid
      container
      sx={styles.clientesContainer}
      direction={"column"}
      spacing={2}
    >
      <Grid container size={12} justifyContent="center">
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="Platform"
        >
          <ToggleButton value="servicios">Servicios</ToggleButton>
          <ToggleButton value="productos">Productos</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.actionBar}>
            <Box component="div" display={"flex"} sx={{ gap: 2 }}>
              <Box component="div" sx={{ width: "200px" }}>
                <EstilistaFilter
                  ctxValue={estilistaFilter}
                  ctxDispatch={handleEstilistaChange}
                />
              </Box>
              <Box component="div" sx={{ width: "200px" }}>
                <FechaInput
                  ctxValue={fechaFilter}
                  ctxDispatch={handleFechaChange}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Guardar Excel
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid container sx={styles.tableContainer} size={12}>
        <ReportesTable
          reportesData={
            view === "servicios" ? serviciosFiltred : productosFiltred
          }
          download={download}
          setDownload={setDownload}
          currentDate={fechaFilter}
          filtro={estilistaFilter}
          view={view}
        />
      </Grid>
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.footer}>
            <Typography variant="h6">{`Total: $${view === "servicios" ? totalServicios.toFixed(2) : totalProductos.toFixed(2)}`}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Reportes;
