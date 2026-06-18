import { Grid, Typography } from "@mui/material";
import { Cita } from "../../types/Cita";
import TotalServiciosTbl from "./TotalServiciosTbl";
import TotalProductosTbl from "./TotalProductosTbl";
import { useEffect, useMemo, useState } from "react";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";

type Props = {
  cita: Cita | null;
  citas: Cita[] | [];
  setTotalCita: React.Dispatch<React.SetStateAction<number>>;
};

function TotalCitaTbl({ cita, citas, setTotalCita }: Props) {
  // Función para calcular el total usando reduce
  const [servicios, setServicios] = useState<ServicioAgendado[] | []>([]);
  const [productos, setProductos] = useState<ProductoInCita[] | []>([]);

  // const getServiciosFromCitas = () => {
  //   if (citas.length > 1){
  //     const allServicios = citas.reduce((accServicios: ServicioAgendado[], currentCita) => {
  //       const serviciosCita = currentCita.servicios
  //       accServicios.push(...serviciosCita)
  //       return accServicios
  //     }, [])
  //     return allServicios
  //   }else {
  //     return cita?.servicios || []
  //   }
  // }

  const getServiciosProductosFromCitas = () => {
    if (citas.length > 1) {
      let allServicios: ServicioAgendado[] = [];
      let allProductos: ProductoInCita[] = [];

      citas.forEach((cita) => {
        const serviciosCita = cita.servicios;
        const productosCita = cita.productos;
        allServicios = [...allServicios, ...serviciosCita];
        allProductos = [...allProductos, ...productosCita];
      });

      setServicios(() => allServicios);
      setProductos(() => allProductos);
    }else {
      setServicios(()=> cita?.servicios || [])
      setProductos(() => cita?.productos || [])
    }
  };

  const totalServicios = useMemo(() => {
    return servicios.reduce((acumulador, servicio) => {
      return acumulador + Number(servicio.servicio.precio);
    }, 0);
  }, [servicios]); // Se recalcula cuando 'cita?.servicios' cambia

  const totalProductos = useMemo(() => {
    return productos.reduce((acumulador, producto) => {
      return acumulador + Number(producto.precio) * Number(producto.cantidad);
    }, 0);
  }, [productos]); // Se recalcula cuando 'cita?.productos' cambia

  useEffect(() =>{
    getServiciosProductosFromCitas()
  }, [citas])

  useEffect(() => {
    setTotalCita(totalServicios + totalProductos);
  }, [totalServicios, totalProductos, setTotalCita]);

  return (
    <Grid container spacing={1}>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {totalServicios !== undefined
              ? `Servicios | Total: $${totalServicios}`
              : "Servicios | Total: $0.00"}
          </Typography>
        </Grid>
        <Grid size={12}>
          <TotalServiciosTbl servicios={servicios} />
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
          <TotalProductosTbl productos={productos} />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={12} justifyItems="flex-end">
          <Typography variant="h6" fontWeight="bold">
            Total de la cita: ${totalServicios + totalProductos}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TotalCitaTbl;
