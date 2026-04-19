import { Grid, Typography } from "@mui/material";
import { Cita } from "../../types/Cita";
import TotalServiciosTbl from "./TotalServiciosTbl";
import TotalProductosTbl from "./TotalProductosTbl";
import { useMemo } from "react";

type Props = {
  cita: Cita | null;
};

function TotalCitaTbl({ cita }: Props) {
  // Función para calcular el total usando reduce
  const totalServicios = useMemo(() => {
    return cita?.servicios.reduce((acumulador, servicio) => {
      return acumulador + Number(servicio.servicio.precio);
    }, 0);
  }, [cita?.servicios]); // Se recalcula cuando 'cita?.servicios' cambia

    const totalProductos = useMemo(() => {
    return cita?.productos.reduce((acumulador, producto) => {
      return acumulador + Number(producto.precio) * Number(producto.cantidad);
    }, 0);
  }, [cita?.productos]); // Se recalcula cuando 'cita?.productos' cambia

  return (
    <Grid container spacing={2}>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {totalServicios !== undefined
              ? `Servicios | Total: $${totalServicios}`
              : "Servicios | Total: $0.00"}
          </Typography>
        </Grid>
        <Grid size={12}>
          <TotalServiciosTbl servicios={cita ? cita.servicios : []} />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {totalProductos !== undefined
              ? `Productos | Total: $${totalProductos}`
              : "Productos | Total: $0.00"}
          </Typography>
        </Grid>
        <Grid size={12}>
          <TotalProductosTbl productos={cita ? cita.productos : []} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TotalCitaTbl;
