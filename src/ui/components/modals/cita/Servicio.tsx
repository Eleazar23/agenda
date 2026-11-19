import React, { useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EstilistaInput from "../../Inputs/EstilistaInput";
import HoraFinInput from "../../Inputs/HoraFinInput";
import ServiciosInput from "../../Inputs/ServiciosInput";
import ProductsCar from "../../tables/ProductsCar";
import AddProductForm from "../../forms/AddProductForm";
import { Producto, ProductoInCita } from "../../../types/Producto";
import useGlobalAlert from "../../GlobalAlert";
import { ServicioAgendado } from "../../../types/ServicioAgendado";
import {
  formatDuracion,
  getDuracion,
  getOccupiedRows,
  seSobreponeConOtroServicio,
} from "../../../utils/utils";
import { Cita } from "../../../types/Cita";
import DeleteBtn from "../../buttons/DeleteBtn";
import FieldLabel from "../../Inputs/FieldLabel";
import {
  COMPACT_FIELD_HEIGHT,
  compactFieldSx,
} from "../../../utils/compactFieldSx";
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
  const [isAddingProducto, setIsAddingProducto] = React.useState(false);
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

  return (
    <Box sx={{ display: "flex", minHeight: 440 }}>
      {/* Izquierda: servicio + notas */}
      <Stack spacing={2.25} sx={{ flex: 1, minWidth: 0, p: 3 }}>
        <SectionTitle>SERVICIO</SectionTitle>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.75} alignItems="flex-end">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FieldLabel>Estilista</FieldLabel>
              <EstilistaInput
                ctxValue={servicioForm.estilista}
                ctxDispatch={handleChange}
                soloEstilistas
                variant="outlined"
                size="small"
                hideLabel
                sx={compactFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1.3, minWidth: 0 }}>
              <FieldLabel htmlFor="servicio-cita-input">Servicio</FieldLabel>
              <ServiciosInput
                id="servicio-cita-input"
                value={servicioForm.servicio}
                onChange={(newServicio) => {
                  handleChange("servicio", newServicio);
                }}
                variant="outlined"
                size="small"
                hideLabel
                sx={compactFieldSx}
              />
            </Box>
            <Box sx={{ width: 80, flexShrink: 0 }}>
              <FieldLabel>Precio</FieldLabel>
              <Box
                sx={{
                  height: COMPACT_FIELD_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={700} sx={{ fontSize: 15 }}>
                  ${servicioForm.servicio?.precio}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.75} alignItems="flex-end">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FieldLabel htmlFor="hora-inicio-input">Hora inicio</FieldLabel>
              <HoraFinInput
                id="hora-inicio-input"
                label="Hora Inicio"
                hora={servicioForm.horaInicio}
                readOnly={false}
                onChange={handleHoraInicioChange}
                variant="outlined"
                size="small"
                hideLabel
                sx={compactFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FieldLabel htmlFor="hora-fin-input">Hora fin</FieldLabel>
              <HoraFinInput
                id="hora-fin-input"
                label="Hora Fin"
                hora={servicioForm.horaFin}
                readOnly={false}
                onChange={handleHoraFinChange}
                variant="outlined"
                size="small"
                hideLabel
                sx={compactFieldSx}
              />
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ height: COMPACT_FIELD_HEIGHT, flexShrink: 0 }}
            >
              {servicioForm.duracion > 0 && (
                <Chip
                  size="small"
                  label={`Duración: ${formatDuracion(servicioForm.duracion)}`}
                  sx={{ bgcolor: "action.hover", fontWeight: 600 }}
                />
              )}
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
            </Stack>
          </Stack>
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <FieldLabel htmlFor="notas-cita-input">Notas (opcional)</FieldLabel>
          <TextField
            id="notas-cita-input"
            name="notas"
            placeholder="Agregar una nota sobre esta cita…"
            variant="outlined"
            fullWidth
            multiline
            minRows={6}
            value={citaForm.notas || ""}
            onChange={(e) => handleCitaChange("notas", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#fbfbfc",
                fontSize: 14,
                "& fieldset": { borderStyle: "dashed", borderColor: "#e3e5e8" },
              },
            }}
          />
        </Box>
      </Stack>

      {/* Derecha: productos */}
      <Stack
        spacing={1.5}
        sx={{
          width: 380,
          flexShrink: 0,
          boxSizing: "border-box",
          p: 2.75,
          bgcolor: "#f8f9fb",
          borderLeft: "1px solid #edeef0",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <SectionTitle>PRODUCTOS</SectionTitle>
          {isAddingProducto ? (
            <Button
              size="small"
              onClick={() => setIsAddingProducto(false)}
              sx={{ fontWeight: 600 }}
            >
              Listo
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setIsAddingProducto(true)}
            >
              Agregar
            </Button>
          )}
        </Stack>

        {isAddingProducto && <AddProductForm ctxAddProducto={handleAddProducto} />}

        {productos.length > 0 ? (
          <ProductsCar
            products={productos}
            handleRemoveProducto={handleRemoveProducto}
            handleCambiarCantidad={handleCambiarCantidad}
            disabled={isGuardandoProductos}
          />
        ) : (
          !isAddingProducto && (
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Aún no se agregaron productos a esta cita.
              </Typography>
            </Box>
          )
        )}
      </Stack>
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{ letterSpacing: ".05em", color: "text.secondary", fontWeight: 700 }}
    >
      {children}
    </Typography>
  );
}

export default ServicioForm;
