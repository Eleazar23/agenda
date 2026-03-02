import React from 'react'
import { Divider, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import EstilistaInput from '../../Inputs/EstilistaInput'
import HoraInput from '../../Inputs/HoraInput'
import ServiciosInput from '../../Inputs/ServiciosInput'
import ProductsCar from '../../tables/ProductsCar'
import AddProductForm from '../../forms/AddProductForm'
import StatusCita from '../../Inputs/StatusCita'
import MetodoPagoInput from '../../Inputs/MetodoPagoInput'

function Servicio() {
    const [modalForm, setModalForm] = React.useState({
      id: 0,
      rowIndex: 0,
      cellID: "",
      fecha: "",
      estilista: "",
      nombreCliente: "",
      telefonoCliente: "",
      servicio: { id: 0, nombre: "", precio: "" },
      horaInicio: "",
      horaFin: "",
      duracion: 0,
      estado: "sin confirmar",
      metodoDePago: "",
      notas: "",
    });
      const [productos, setProductos] = React.useState([
        { nombre: "Shampoo", precio: 10, cantidad: 2 },
        { nombre: "Acondicionador", precio: 15, cantidad: 1 },
        { nombre: "Mascarilla", precio: 20, cantidad: 1 },
        { nombre: "Spray", precio: 12, cantidad: 3 },
        { nombre: "Gel", precio: 8, cantidad: 2 },
      ]);

    const handleChange = (field: string, value: any) => {
        setModalForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
  return (
              <Grid container spacing={2} gap={2} flexGrow={1}>
            <Grid size={12}>
              <Typography variant="h6" fontWeight="bold">
                Servicio
              </Typography>
            </Grid>
            <Grid container size={12} spacing={2} flexGrow={1}>
              <Grid size={3}> 
                <EstilistaInput
                  ctxValue={modalForm.estilista}
                  ctxDispatch={handleChange}
                />
              </Grid>
              <Grid size={3}>
                <ServiciosInput
                  value={modalForm.servicio || null}
                  onChange={(newServicio) => {
                    handleChange("servicio", newServicio);
                  }}
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  label="Precio"
                  name="precio"
                  variant="filled"
                  fullWidth
                  value={modalForm.servicio?.precio}
                  slotProps={{
                    input:{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }
                  }}
                />
              </Grid>
              <Grid size={2}>
                <HoraInput
                  label="Hora Inicio"
                  name="horaInicio"
                  hora={modalForm.horaInicio}
                  onChange={(newHora) => handleChange("horaInicio", newHora)}
                />
              </Grid>
              <Grid size={2}>
                <HoraInput
                  label="Hora Fin"
                  name="horaFin"
                  hora={modalForm.horaFin}
                  onChange={(newHora) => handleChange("horaFin", newHora)}
                />
              </Grid>
            </Grid>

            <Grid size={12} spacing={2} flexGrow={1}>
              <Divider flexItem />
            </Grid>

            <Grid container size={12}>
              <Grid size={12}>
                <Typography variant="h6" fontWeight="bold">
                  Productos
                </Typography>
              </Grid>
              <Grid container size={12} spacing={2} flexGrow={1}>
                <Grid size={12}>
                  <ProductsCar products={productos} />
                </Grid>
              </Grid>
              <Grid container size={12} justifyContent="flex-end">
                <AddProductForm />
              </Grid>
            </Grid>

            <Grid size={12} spacing={2} flexGrow={1}>
              <Divider flexItem />
            </Grid>

            <Grid container size={12} spacing={2}>
              <Grid size={6}>
                <TextField
                  name="notas"
                  label="Notas"
                  variant="filled"
                  fullWidth
                  multiline
                  rows={4}
                  value={modalForm.notas || ""}
                  onChange={(e) => handleChange("notas", e.target.value)}
                />
              </Grid>
              <Grid size={6} sx={{ height: "100%" }} flexGrow={1}>
                <Stack
                  spacing={1}
                  sx={{ height: "100%" }}
                  justifyContent="space-between"
                >
                  <StatusCita
                    ctxDispatch={handleChange}
                    ctxValue={modalForm.estado}
                  />
                  <MetodoPagoInput
                    ctxDispatch={handleChange}
                    ctxValue={modalForm.metodoDePago}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
  )
}

export default Servicio