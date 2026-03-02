import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import ReportesTable from "../tables/ReportesTable";
import EstilistaInput from "../Inputs/EstilistaInput";
import FechaInput from "../Inputs/FechaInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Cita } from "../../types/Cita";

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
  const [reportesData, setReportesData] = useState<Cita[]>([]);
  const [estilistaFilter, setEstilistaFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [metodoDePagoFilter, setMetodoDePagoFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [download, setDownload] = useState(false);
  console.log("Reportes Data:", reportesData);

  const filterReportesData = (citas: Cita[]) => {
    let filtaredData = citas.filter((cita) => cita.estado === "pagado");
    if (estilistaFilter) {
      filtaredData = filtaredData.filter(
        (cita) => cita.estilista === estilistaFilter,
      );
    }
    if (fechaFilter) {
      filtaredData = filtaredData.filter(
        (cita) => cita.fecha === fechaFilter,
      );
    }
    if (metodoDePagoFilter) {
      filtaredData = filtaredData.filter(
        (cita) => cita.metodoDePago === metodoDePagoFilter,
      );
    }
    return filtaredData;
  };

  const handleEstilistaChange = (inputName: string, estilista: string) => {
    // Lógica para filtrar los reportes por estilista
    if (estilista === "todos") {
      setEstilistaFilter("");
      return;
    }
    setEstilistaFilter(estilista);
  };

  const handleFechaChange = (inputName: string, fecha: string) => {
    // Lógica para filtrar los reportes por fecha
    setFechaFilter(() => fecha);
  };

  const handleDownload = () => {
    // Lógica para descargar el reporte en Excel
    setDownload(true);
  };

  const getFilteredReportesData = () => {
    let filteredData = allCitas;
    if (estilistaFilter) {
      filteredData = filteredData.filter(
        (reporte) => reporte.estilista === estilistaFilter,
      );
    }
    // if (fechaFilter) {
    //   filteredData = filteredData.filter(
    //     (reporte) => reporte.fecha === fechaFilter
    //   );
    // }
    return filteredData;
  };

  const getTotalCosto = (data: Cita[]) => {
    console.log("Calculating total costo for data:", data);
      const totalCosto = data.reduce((acc, reporte) => {
      acc + Number(reporte.servicio.precio);
      return acc;
    }, 0);
    return totalCosto;
  };

  // Load all citas from MongoDB on mount
  const getCitasByFecha = async (fecha: string) => {
        try {
        const allCitasFromDBByFecha = await window.api.getCitasByFecha(fechaFilter);
        const filteredCitas = filterReportesData(allCitasFromDBByFecha);
        setReportesData(() => filteredCitas);
      } catch (error) {
        console.error("Error loading all citas:", error);
      }
  };

  // useEffect(() => {
  //   const loadAllCitas = async () => {
  //     try {
  //       const allCitasFromDBByFecha = await window.api.getCitasByFecha(fechaFilter);
  //       console.log({ fechaFilter, allCitasFromDBByFecha });
  //       const filteredCitas = filterReportesData(allCitasFromDBByFecha);
  //       setReportesData(() => filteredCitas);
  //     } catch (error) {
  //       console.error("Error loading all citas:", error);
  //     }
  //   };
  //   loadAllCitas();
  // }, [fechaFilter]);

  useEffect(() => {
    // Lógica para obtener los datos de los reportes
    const filteredData = getFilteredReportesData();
    const totalCosto = getTotalCosto(filteredData);
    setReportesData(() => filteredData);
    setTotal(() => totalCosto);
  }, [allCitas, estilistaFilter]);

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
            <Box component="div" display={"flex"} sx={{ gap: 2 }}>
              <Box component="div" sx={{ width: "200px" }}>
                <EstilistaInput
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
          reportesData={reportesData}
          download={download}
          setDownload={setDownload}
          currentDate={fechaFilter}
          filtro={estilistaFilter}
        />
      </Grid>
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.footer}>
            <Typography variant="h6">{`Total: $${total.toFixed(2)}`}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Reportes;
