import { Grid, Typography } from "@mui/material";
import { Cita, Propina } from "../../types/Cita";
import TotalServiciosTbl from "./TotalServiciosTbl";
import TotalProductosTbl from "./TotalProductosTbl";
import TotalPropinasTbl from "./TotalPropinasTbl";
import { useEffect, useMemo, useState } from "react";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";
import { formatMoney } from "../../utils/utils";

type Props = {
  cita: Cita | null;
  citas: Cita[] | [];
  // Vienen del formulario de la cita (no de la BD) para reflejar al
  // instante lo aplicado en el modal de propina, aunque no se haya guardado.
  propinas: Propina[];
  onEditServicio?: (servicio: ServicioAgendado) => void;
  onDeleteServicio?: (servicio: ServicioAgendado) => void;
};

function TotalCitaTbl({
  cita,
  citas,
  propinas,
  onEditServicio,
  onDeleteServicio,
}: Props) {
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

  const totalPropinas = useMemo(() => {
    return propinas.reduce(
      (acumulador, propina) => acumulador + Number(propina.monto),
      0,
    );
  }, [propinas]);

  useEffect(() =>{
    getServiciosProductosFromCitas()
  }, [citas])

  return (
    <Grid container spacing={1}>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {totalServicios !== undefined
              ? `Servicios | Total: ${formatMoney(totalServicios)}`
              : "Servicios | Total: $0.00"}
          </Typography>
        </Grid>
        <Grid size={12}>
          <TotalServiciosTbl
            servicios={servicios}
            onEditServicio={onEditServicio}
            onDeleteServicio={onDeleteServicio}
          />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {totalProductos !== undefined
              ? `Productos | Total: ${formatMoney(totalProductos)}`
              : "Productos | Total: $0.00"}
          </Typography>
        </Grid>
        <Grid size={12}>
          <TotalProductosTbl productos={productos} />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">
            {`Propinas | Total: ${formatMoney(totalPropinas)}`}
          </Typography>
        </Grid>
        <Grid size={12}>
          {propinas.length > 0 ? (
            <TotalPropinasTbl propinas={propinas} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin propinas. Usa el botón "Propina" para agregarla.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={12} justifyItems="flex-end">
          <Typography variant="body1">
            Total cita: {formatMoney(totalServicios + totalProductos)}
          </Typography>
          <Typography variant="body1" color="secondary.main">
            Propinas: + {formatMoney(totalPropinas)}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Total a cobrar: {formatMoney(totalServicios + totalProductos + totalPropinas)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TotalCitaTbl;
