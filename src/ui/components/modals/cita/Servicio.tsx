import React, { useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EstilistaInput from "../../Inputs/EstilistaInput";
import HoraInput from "../../Inputs/HoraInput";
import ServiciosInput from "../../Inputs/ServiciosInput";
import ProductsCar from "../../tables/ProductsCar";
import AddProductForm from "../../forms/AddProductForm";
import StatusCita from "../../Inputs/StatusCita";
import MetodoPagoInput from "../../Inputs/MetodoPagoInput";
import { Producto, ProductoInCita } from "../../../types/Producto";
import useGlobalAlert from "../../GlobalAlert";
import { ServicioAgendado } from "../../../types/ServicioAgendado";
import { getDuracion } from "../../../utils/utils";
import { Cita } from "../../../types/Cita";
import DeleteIcon from "@mui/icons-material/Delete";

type ServicioFormProps = {
  servicio: ServicioAgendado;
  citaForm: Cita;
  setCitaForm: React.Dispatch<React.SetStateAction<Cita>>;
  updateProductosInCita: (newProductos: Array<ProductoInCita>) => void;
  updateServicioInCita: (updatedServicio: ServicioAgendado) => void;
  handleRemoveService: (servicio: ServicioAgendado) => void;
};

const initialServicioForm = {
  rowIndex: 0,
  cellID: "",
  fecha: "",
  estilista: "",
  servicio: { id: 0, nombre: "", precio: 0 },
  horaInicio: "",
  horaFin: "",
  duracion: 0,
};

function ServicioForm({
  servicio,
  citaForm,
  setCitaForm,
  updateProductosInCita,
  updateServicioInCita,
  handleRemoveService,
}: ServicioFormProps) {
  const { showAlert } = useGlobalAlert();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [servicioForm, setModalForm] = React.useState<ServicioAgendado>({
    rowIndex: servicio.rowIndex || 0,
    cellID: servicio.cellID || "",
    fecha: servicio.fecha || "",
    estilista: servicio.estilista || "",
    servicio: servicio.servicio || { id: 0, nombre: "", precio: 0 },
    horaInicio: servicio.horaInicio || "",
    horaFin: servicio.horaFin || "",
    duracion: servicio.duracion || 0,
  });

  //   {
  //   "id": 0,
  //   "rowIndex": 5,
  //   "cellID": "5-Mimi",
  //   "fecha": "17-03-2026",
  //   "estilista": "Mimi",
  //   "servicio": {
  //     "id": 1,
  //     "nombre": "Corte de cabello H",
  //     "precio": "150",
  //   },
  //   "horaInicio": "02:30",
  //   "horaFin": "02:30",
  //   "duracion": 0
  // }

  const [productos, setProductos] = React.useState<
    {
      id: number;
      nombre: string;
      precio: number;
      cantidad: number;
      estilista: string;
      total: number;
    }[]
  >(citaForm.productos || []);

  const handleChange = (field: string, value: any) => {
    setModalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveServiceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPopoverOpen(true);
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleDuracionChange = () => {
    const newDuracion = getDuracion(
      servicioForm.horaInicio,
      servicioForm.horaFin,
    );
    setModalForm({
      ...servicioForm,
      duracion: newDuracion,
    });
  };

  const handleAddProducto = (newProducto: {
    producto: Producto;
    cantidad: number;
    estilista: string;
  }) => {
    const newRow = {
      id: newProducto.producto.id,
      nombre: newProducto.producto.nombre,
      precio: newProducto.producto.precio,
      cantidad: newProducto.cantidad,
      total: newProducto.producto.precio * newProducto.cantidad,
      estilista: newProducto.estilista,
    };
    const existingIndex = productos.findIndex((prod) => prod.id === newRow.id);
    let succesAction = true;
    if (existingIndex !== -1) {
      // Si el producto ya existe, actualiza la cantidad y el total
      setProductos((prev) => {
        let updatedProducts = [...prev];
        let existingProduct = updatedProducts[existingIndex];
        let newCantidad = existingProduct.cantidad + newRow.cantidad;

        if (newCantidad > newProducto.producto.stock) {
          showAlert(
            "No hay suficiente stock para agregar esa cantidad.",
            "error",
          );
          newCantidad = newProducto.producto.stock; // Limitar la cantidad al stock disponible
          succesAction = false;
          return prev; // No actualizar el estado si se excede el stock
        }

        existingProduct.cantidad += newRow.cantidad;
        existingProduct.total =
          existingProduct.cantidad * existingProduct.precio;

        return updatedProducts;
      });
    } else {
      setProductos((prev) => [...prev, newRow]);
    }
    return succesAction;
  };

  const handleRemoveProducto = (id: number) => {
    setProductos((prev) => prev.filter((prod) => prod.id !== id));
  };

  const handleCitaChange = (field: string, value: any) => {
    setCitaForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    handleDuracionChange();
  }, [servicioForm.horaInicio, servicioForm.horaFin]);

  useEffect(() => {
    updateServicioInCita(servicioForm);
  }, [servicioForm]);

  // useEffect(() => {
  //   if (servicio) {
  //     setModalForm((prev) => ({
  //       ...prev,
  //       horaInicio: servicio.horaInicio,
  //       horaFin: servicio.horaFin,
  //       duracion: servicio.duracion,
  //     }));
  //   }
  // }, [servicio]);

  useEffect(() => {
    updateProductosInCita(productos);
  }, [productos]);

  return (
    <Grid container spacing={2} gap={2} flexGrow={1}>
      <Grid size={12}>
        <Typography variant="h6" fontWeight="bold">
          Servicio
        </Typography>
      </Grid>
      <Grid container size={12} spacing={2} flexGrow={1}>
        <Grid size={2}>
          <EstilistaInput
            ctxValue={servicioForm.estilista}
            ctxDispatch={handleChange}
          />
        </Grid>
        <Grid size={3}>
          <ServiciosInput
            value={servicioForm.servicio}
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
            value={servicioForm.servicio?.precio}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={2}>
          <HoraInput
            label="Hora Inicio"
            name="horaInicio"
            hora={servicioForm.horaInicio}
            onChange={(newHora) => handleChange("horaInicio", newHora)}
          />
        </Grid>
        <Grid size={2}>
          <HoraInput
            label="Hora Fin"
            name="horaFin"
            hora={servicioForm.horaFin}
            onChange={(newHora) => handleChange("horaFin", newHora)}
          />
        </Grid>
        <Grid size={1} sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <IconButton onClick={handleRemoveServiceClick}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
          <Popover
            id="remove-service-popover"
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }}>
              Estas seguro que deseas eliminar este servicio?
            </Typography>
            <Box display="flex" justifyContent="space-around" padding={1}>
              <IconButton color="primary" onClick={handleClosePopover}>
                No
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  handleRemoveService(servicioForm);
                  handleClosePopover();
                }}
              >
                Si
              </IconButton>
            </Box>
          </Popover>
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
            <ProductsCar
              products={productos}
              handleRemoveProducto={handleRemoveProducto}
            />
          </Grid>
        </Grid>
        <Grid container size={12} justifyContent="flex-start">
          <AddProductForm ctxAddProducto={handleAddProducto} />
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
            value={citaForm.notas || ""}
            onChange={(e) => handleCitaChange("notas", e.target.value)}
          />
        </Grid>
        <Grid size={6} sx={{ height: "100%" }} flexGrow={1}>
          <Stack
            spacing={1}
            sx={{ height: "100%" }}
            justifyContent="space-between"
          >
            <StatusCita
              ctxDispatch={handleCitaChange}
              ctxValue={citaForm.estado}
            />
            <MetodoPagoInput
              ctxDispatch={handleCitaChange}
              ctxValue={citaForm.metodoDePago}
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ServicioForm;
