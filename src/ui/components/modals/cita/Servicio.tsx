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
import HoraFinInput from "../../Inputs/HoraFinInput";
import ServiciosInput from "../../Inputs/ServiciosInput";
import ProductsCar from "../../tables/ProductsCar";
import AddProductForm from "../../forms/AddProductForm";
import StatusCita from "../../Inputs/StatusCita";
import MetodoPagoInput from "../../Inputs/MetodoPagoInput";
import { Producto, ProductoInCita } from "../../../types/Producto";
import useGlobalAlert from "../../GlobalAlert";
import { ServicioAgendado } from "../../../types/ServicioAgendado";
import {
  getDuracion,
  getOccupiedRows,
  seSobreponeConOtroServicio,
} from "../../../utils/utils";
import { Cita } from "../../../types/Cita";
import DeleteBtn from "../../buttons/DeleteBtn";
import { useAgendaContext } from "../../../contexts/AgendaContext";

type ServicioFormProps = {
  servicio: ServicioAgendado;
  citaForm: Cita;
  setCitaForm: React.Dispatch<React.SetStateAction<Cita>>;
  guardarProductos: (newProductos: Array<ProductoInCita>) => Promise<boolean>;
  updateServicioInCita: (updatedServicio: ServicioAgendado) => void;
  handleRemoveService: (servicio: ServicioAgendado) => void;
};

function ServicioForm({
  servicio,
  citaForm,
  setCitaForm,
  guardarProductos,
  updateServicioInCita,
  handleRemoveService,
}: ServicioFormProps) {
  const { showAlert } = useGlobalAlert();
  const { citas } = useAgendaContext();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isGuardandoProductos, setIsGuardandoProductos] = React.useState(false);
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

  // Los productos se leen directo de citaForm (única fuente de verdad):
  // la cita se carga async desde BD después de montar este componente.
  const productos = citaForm.productos || [];

  const handleChange = (field: string, value: unknown) => {
    setModalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHoraInicioChange = (newHora: string) => {
    if (servicioForm.horaFin && newHora >= servicioForm.horaFin) {
      showAlert(
        "La hora de inicio debe ser anterior a la hora de fin",
        "error",
      );
      return;
    }
    handleChange("horaInicio", newHora);
  };

  const handleHoraFinChange = (newHora: string) => {
    if (servicioForm.horaInicio && newHora <= servicioForm.horaInicio) {
      showAlert(
        "La hora de fin debe ser posterior a la hora de inicio",
        "error",
      );
      return;
    }

    const newDuracion = getDuracion(servicioForm.horaInicio, newHora);
    const newRowIndexes = getOccupiedRows({
      rowIndex: servicioForm.rowIndex,
      duracion: newDuracion,
    });

    // Se compara contra otras citas del mismo día (excluyendo esta misma
    // cita, cuyos propios servicios ya se comparan por separado) y contra
    // los demás servicios de esta cita, para no permitir una hora de fin
    // que choque con otro servicio ya agendado.
    const citasDelDia = citas.filter(
      (c) => c.fecha === citaForm.fecha && c.id !== citaForm.id,
    );
    const otrosServiciosPropios = citaForm.servicios.filter(
      (s) => s.cellID !== servicioForm.cellID,
    );

    if (
      seSobreponeConOtroServicio(
        servicioForm.estilista,
        newRowIndexes,
        citasDelDia,
        otrosServiciosPropios,
      )
    ) {
      showAlert(
        "La hora de fin se sobrepone con otro servicio ya agendado",
        "error",
      );
      return;
    }

    handleChange("horaFin", newHora);
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

  // Se guarda en BD al momento; la validación de stock se hace ahí contra
  // el stock actual.
  const handleAddProducto = async (newProducto: {
    producto: Producto;
    cantidad: number;
    estilista: string;
  }) => {
    const { producto, cantidad, estilista } = newProducto;

    const existingProduct = productos.find((prod) => prod.id === producto.id);
    const newProductos = existingProduct
      ? productos.map((prod) =>
          prod.id === producto.id
            ? {
                ...prod,
                cantidad: prod.cantidad + cantidad,
                total: (prod.cantidad + cantidad) * prod.precio,
              }
            : prod,
        )
      : [
          ...productos,
          {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
            total: producto.precio * cantidad,
            estilista,
          },
        ];
    return guardarConBloqueo(newProductos);
  };

  // Cada cambio se guarda en BD al momento; mientras tanto se bloquean los
  // controles para no encimar guardados.
  const guardarConBloqueo = async (newProductos: ProductoInCita[]) => {
    if (isGuardandoProductos) return false;
    setIsGuardandoProductos(true);
    try {
      return await guardarProductos(newProductos);
    } finally {
      setIsGuardandoProductos(false);
    }
  };

  const handleRemoveProducto = (id: number) => {
    guardarConBloqueo(productos.filter((prod) => prod.id !== id));
  };

  const handleCambiarCantidad = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    guardarConBloqueo(
      productos.map((prod) =>
        prod.id === id
          ? { ...prod, cantidad, total: cantidad * Number(prod.precio) }
          : prod,
      ),
    );
  };

  const handleCitaChange = (field: string, value: unknown) => {
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
            soloEstilistas
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
          <HoraFinInput
            label="Hora Inicio"
            hora={servicioForm.horaInicio}
            readOnly={false}
            onChange={handleHoraInicioChange}
          />
        </Grid>
        <Grid size={2}>
          <HoraFinInput
            label="Hora Fin"
            hora={servicioForm.horaFin}
            readOnly={false}
            onChange={handleHoraFinChange}
          />
        </Grid>
        <Grid size={1} sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <DeleteBtn onClick={handleRemoveServiceClick} />
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
              handleCambiarCantidad={handleCambiarCantidad}
              disabled={isGuardandoProductos}
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
              name="metodoDePago"
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ServicioForm;
