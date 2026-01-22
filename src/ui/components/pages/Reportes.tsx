import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import ReportesTable from "../tables/ReportesTable";
import EstilistaInput from "../Inputs/EstilistaInput";
import FechaInput from "../Inputs/FechaInput";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Cita } from "../../types/Cita";
import { globalData } from "../../mock/globalData";

type Reporte = {
  estilista: string;
  nombreCliente: string;
  servicio: string;
  costo: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
};

const mockData: Reporte[] = [
  {
    estilista: "tomi",
    nombreCliente: "Eleazar Celis",
    servicio: "Corte de cabello",
    costo: 250,
    fecha: "03-12-2025",
    horaInicio: "10:00",
    horaFin: "11:00",
    duracion: 60,
  },
  {
    estilista: "mimi",
    nombreCliente: "Michelle Celis",
    servicio: "Peinado",
    costo: 300,
    fecha: "03-12-2025",
    horaInicio: "11:30",
    horaFin: "12:15",
    duracion: 45,
  },
];

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
  const { citas } = useAgendaContext();
  const [reportesData, setReportesData] = useState<Cita[]>([...citas]);
  const [estilistaFilter, setEstilistaFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [download, setDownload] = useState(false);
  console.log("Reportes Data:", reportesData);

  const handleEstilistaChange = (inputName: string, estilista: string) => {
    // Lógica para filtrar los reportes por estilista
    if (estilista === "todos") {
      setEstilistaFilter("");
      return;
    }
    // const filteredData = reportesData.filter( (reporte) => reporte.estilista === estilista );
    setEstilistaFilter(estilista);
    // setReportesData(filteredData);
  };

  const handleFechaChange = (inputName: string, fecha: string) => {
    // Lógica para filtrar los reportes por fecha
    const filteredData = reportesData.filter( (reporte) => reporte.fecha === fecha );
    setFechaFilter(fecha);
    // setReportesData(filteredData);
  };

  const handleDownload = () => {
    // Lógica para descargar el reporte en Excel
    setDownload(true);
  }

  const getFilteredReportesData = () => {
    let filteredData = globalData.citas;
    if (estilistaFilter) {
      filteredData = filteredData.filter(
        (reporte) => reporte.estilista === estilistaFilter
      );
    }
    if (fechaFilter) {
      filteredData = filteredData.filter(
        (reporte) => reporte.fecha === fechaFilter
      );
    }
    return filteredData;
  };

  useEffect(() => {
    // Lógica para obtener los datos de los reportes
    const filteredData = getFilteredReportesData();
    setReportesData(filteredData);
  }, [estilistaFilter, fechaFilter]);

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
              <EstilistaInput ctxValue={estilistaFilter} ctxDispatch={handleEstilistaChange} />
            </Box>
            <Box component="div" sx={{ width: "200px" }}>
                <FechaInput ctxValue={fechaFilter} ctxDispatch={handleFechaChange} />
            </Box>
                </Box>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Guardar Excel
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid container sx={styles.tableContainer} size={12}>
        <ReportesTable reportesData={reportesData} setTotal={setTotal} download={download} setDownload={setDownload} currentDate={fechaFilter} filtro={estilistaFilter} />
      </Grid>
      <Grid container size={12}>
        <Paper sx={styles.paper}>
          <Box component="div" sx={styles.footer}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Reportes;
