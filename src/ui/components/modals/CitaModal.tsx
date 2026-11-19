import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAgendaContext } from "../../contexts/AgendaContext";
import {
  Avatar,
  Box,
  Divider,
  Popover,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  formatDateFromHTML,
  formatDateToHTML,
  getOfficeHours,
} from "../../utils/utils";
import { Cita } from "../../types/Cita";
//Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
// import Servicio from "./cita/Servicio";
import TotalCitaTbls from "../tables/TotalCitaTbls";
import ServicioForm from "./cita/Servicio";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";
import { getCitasByFechaClienteId } from "../../services/citasApi";
import PropinaModal from "./PropinaModal";
import CambiosSinGuardarDialog from "./cita/CambiosSinGuardarDialog";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import BitacoraBtn from "../buttons/BitacoraBtn";
import BitacoraModal from "./clientes/BitacoraModal";
import FieldLabel from "../Inputs/FieldLabel";
import StatusCitaChip from "../Inputs/StatusCitaChip";
import { compactFieldSx } from "../../utils/compactFieldSx";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";

const METODOS_DE_PAGO = [
  { value: "efectivo", label: "Efectivo", Icon: PaymentsOutlinedIcon },
  { value: "tarjeta", label: "Tarjeta", Icon: CreditCardOutlinedIcon },
  { value: "transferencia", label: "Transferencia", Icon: SwapHorizOutlinedIcon },
];

type CitaModalProps = {
  fecha: string;
  clienteId: number;
  nombreCliente: string;
  telefonoCliente?: string;
  servicio: ServicioAgendado;
  estado: string;
  isCitaOpen: boolean;
  setIsCitaOpen: (open: boolean) => void;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Solo los campos que se editan en el modal. Se omiten los derivados
// (rowIndex, duracion), metadatos de MongoDB y las propinas en 0 (filas que
// solo existen mientras se edita), para no marcar cambios que no lo son.
const resumenEditable = (c: Cita) =>
  JSON.stringify({
    fecha: c.fecha,
    estado: c.estado,
    metodoDePago: c.metodoDePago,
    notas: c.notas || "",
    servicios: c.servicios.map((s) => ({
      cellID: s.cellID,
      estilista: s.estilista,
      servicioId: s.servicio?.id,
      horaInicio: s.horaInicio,
      horaFin: s.horaFin,
    })),
    productos: c.productos.map((p) => ({
      id: p.id,
      cantidad: Number(p.cantidad),
      estilista: p.estilista,
    })),
    propinas: (c.propinas || [])
      .filter((p) => p.monto > 0)
      .map((p) => ({
        estilista: p.estilista,
        monto: Number(p.monto),
        metodoDePago: p.metodoDePago,
      })),
  });

export default function CitaModal({
  fecha,
  clienteId,
  nombreCliente,
  telefonoCliente,
  servicio,
  estado,
  isCitaOpen,
  setIsCitaOpen,
}: CitaModalProps) {
  // const { agendaData, setAgendaData } = useAgendaContext();
  const [cita, setCita] = useState<Cita | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const { handleEditCita, guardarProductosCita } = useAgendaContext();
  const [view, setView] = useState("servicio");
  const [isSaving, setIsSaving] = useState(false);
  const [isPropinaOpen, setIsPropinaOpen] = useState(false);
  const [isBitacoraOpen, setIsBitacoraOpen] = useState(false);
  const [cobrarAnchorEl, setCobrarAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [metodoCobro, setMetodoCobro] = useState("efectivo");
  const [isConfirmCerrarOpen, setIsConfirmCerrarOpen] = useState(false);
  const [resolvedServicio, setResolvedServicio] =
    useState<ServicioAgendado>(servicio);
  const [citaForm, setCitaForm] = useState<Cita>(
    cita || {
      id: "",
      clienteId,
      fecha,
      nombreCliente,
      telefonoCliente: telefonoCliente || "",
      servicios: [],
      productos: [],
      estado: estado || "sin confirmar",
      metodoDePago: "efectivo",
      notas: "",
      propinas: [],
    },
  );

  const getCitaData = async () => {
    try {
      const citaData = await window.api.getCitaByFechaClienteId(
        fecha,
        clienteId,
      );
      if (!citaData) return;

      setCita(() => citaData);
      setCitaForm((prev) => ({ ...prev, ...citaData }));

      const matchingServicio = citaData.servicios.find(
        (s) => s.cellID === servicio.cellID,
      );
      setResolvedServicio(matchingServicio || servicio);
    } catch (error) {
      console.error("Error al agregar cliente", error);
    }
  };

  const getCitasData = async () => {
    const citasData = await getCitasByFechaClienteId(fecha, clienteId);
    setCitas(citasData);
  };

  const handleRemoveService = async (servicioToRemove: ServicioAgendado) => {
    const updatedServicios = citaForm.servicios.filter(
      (s) => s.cellID !== servicioToRemove.cellID,
    );
    const newCitaData = {
      ...citaForm,
      servicios: updatedServicios,
    };
    setCitaForm(newCitaData);
    const success = await handleEditCita(citaForm.id, newCitaData);
    // Lo que se acaba de guardar pasa a ser la referencia para detectar
    // cambios sin guardar.
    if (success) {
      setCita(newCitaData);
    }
  };

  // La tabla "Total Cita" puede listar servicios de más de una cita del
  // mismo cliente/día (ver TotalCitaTbls), así que hay que ubicar a cuál
  // de ellas pertenece el servicio antes de editarlo o eliminarlo.
  const findCitaByServicio = (
    servicioAgendado: ServicioAgendado,
  ): Cita | null => {
    const citaConServicio = citas.find((c) =>
      c.servicios.some((s) => s.cellID === servicioAgendado.cellID),
    );
    if (citaConServicio) return citaConServicio;
    if (cita?.servicios.some((s) => s.cellID === servicioAgendado.cellID)) {
      return cita;
    }
    return null;
  };

  const handleEditServicioFromTotal = (servicioAgendado: ServicioAgendado) => {
    const citaDelServicio = findCitaByServicio(servicioAgendado);
    if (citaDelServicio && citaDelServicio.id !== citaForm.id) {
      setCita(citaDelServicio);
      setCitaForm(citaDelServicio);
    }
    setResolvedServicio(servicioAgendado);
    setView("servicio");
  };

  const handleDeleteServicioFromTotal = async (
    servicioAgendado: ServicioAgendado,
  ) => {
    const citaDelServicio = findCitaByServicio(servicioAgendado);
    if (!citaDelServicio) return;

    const updatedServicios = citaDelServicio.servicios.filter(
      (s) => s.cellID !== servicioAgendado.cellID,
    );
    const newCitaData = { ...citaDelServicio, servicios: updatedServicios };
    if (citaDelServicio.id === citaForm.id) {
      setCitaForm(newCitaData);
    }

    const success = await handleEditCita(citaDelServicio.id, newCitaData);
    if (success) {
      getCitaData();
      getCitasData();
    }
  };

  // Propinas de todas las citas del cliente ese día (como hace la vista
  // "Total Cita" con servicios y productos), tomando las de la cita en
  // edición desde el formulario para incluir cambios sin guardar.
  const propinasDelDia = useMemo(
    () =>
      [
        ...(citaForm.propinas || []),
        ...citas
          .filter((c) => c.id !== citaForm.id)
          .flatMap((c) => c.propinas || []),
      ].filter((p) => p.monto > 0),
    [citaForm, citas],
  );

  const totalPropinas = (citaForm.propinas || []).reduce(
    (acc, p) => acc + Number(p.monto || 0),
    0,
  );

  // Total de lo que el cliente consume ese día: la cita en edición (con
  // cambios sin guardar) más sus otras citas del mismo día, igual que la
  // vista "Total Cita".
  const totalACobrar = useMemo(() => {
    const otrasCitas = citas.filter((c) => c.id !== citaForm.id);
    return [citaForm, ...otrasCitas].reduce(
      (acc, c) =>
        acc +
        c.servicios.reduce((sum, s) => sum + Number(s.servicio.precio), 0) +
        c.productos.reduce(
          (sum, p) => sum + Number(p.precio) * Number(p.cantidad),
          0,
        ),
      0,
    );
  }, [citaForm, citas]);

  const totalPropinasDelDia = propinasDelDia.reduce(
    (acc, p) => acc + Number(p.monto || 0),
    0,
  );

  const handleAbrirCobro = (e: React.MouseEvent<HTMLElement>) => {
    setMetodoCobro(citaForm.metodoDePago || "efectivo");
    setCobrarAnchorEl(e.currentTarget);
  };

  const handleConfirmarCobro = () => {
    setCobrarAnchorEl(null);
    handleGuardar({ estado: "pagado", metodoDePago: metodoCobro });
  };

  const handleAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) {
      setView(newAlignment);
      return;
    }
  };

  const hayCambiosSinGuardar = useMemo(
    () =>
      cita !== null &&
      cita.id === citaForm.id &&
      resumenEditable(cita) !== resumenEditable(citaForm),
    [cita, citaForm],
  );

  const handleCancelar = () => {
    setCitaForm((prev) => ({ ...prev, ...cita }));
    setIsConfirmCerrarOpen(false);
    setIsCitaOpen(false);
  };

  // X, Esc o clic fuera del modal: si hay cambios se pide confirmación
  const handleClose = () => {
    if (hayCambiosSinGuardar) {
      setIsConfirmCerrarOpen(true);
      return;
    }
    setIsCitaOpen(false);
  };

  const handleGuardarDesdeConfirmacion = () => {
    setIsConfirmCerrarOpen(false);
    handleGuardar();
  };

  const handleGuardar = async (cambios: Partial<Cita> = {}) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Las filas de propina en 0 solo existen mientras se edita.
      const citaAGuardar: Cita = {
        ...citaForm,
        ...cambios,
        propinas: (citaForm.propinas || []).filter((p) => p.monto > 0),
      };
      const success = await handleEditCita(citaForm.id, citaAGuardar);
      // Si el guardado fue rechazado (p.ej. por solape de horarios), el
      // modal se queda abierto para que el usuario corrija antes de reintentar.
      if (success) {
        setIsCitaOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // La venta de productos se guarda en BD (y descuenta stock) al momento,
  // sin esperar al botón Guardar. Se actualiza también la referencia de
  // "cambios sin guardar" para que los productos no cuenten como pendientes.
  const guardarProductos = async (
    newProductos: Array<ProductoInCita>,
  ): Promise<boolean> => {
    const guardados = await guardarProductosCita(citaForm.id, newProductos);
    if (!guardados) return false;
    setCitaForm((prev) => ({ ...prev, productos: guardados }));
    setCita((prev) => (prev ? { ...prev, productos: guardados } : prev));
    getCitasData();
    return true;
  };

  const updateServicioInCita = (updatedServicio: ServicioAgendado) => {
    const newHr = getOfficeHours().find(
      (hr) => hr.label24 === updatedServicio.horaInicio,
    );
    const newRowIndex = newHr ? newHr.index : updatedServicio.rowIndex;
    const serviceToUpdateIndex = citaForm.servicios.findIndex(
      (s) => s.cellID === updatedServicio.cellID,
    );
    if (serviceToUpdateIndex === -1) return;
    const updatedServicios = [...citaForm.servicios];
    updatedServicios[serviceToUpdateIndex] = {
      ...updatedServicio,
      rowIndex: newRowIndex,
    };
    setCitaForm((prev) => ({
      ...prev,
      servicios: updatedServicios,
    }));
  };

  useEffect(() => {
    if (isCitaOpen) {
      getCitaData();
      getCitasData();
    }
  }, [isCitaOpen]);

  const handleChangeFecha = (newDate: string) => {
    const fomattedDate = formatDateFromHTML(newDate);
    setCitaForm({
      ...citaForm,
      fecha: fomattedDate,
    });
  };

  return (
    <>
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isCitaOpen}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          px={3}
          py={2}
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar
              sx={(theme) => ({
                bgcolor: theme.palette.primary.main,
                width: 44,
                height: 44,
              })}
            >
              <AccountCircleOutlinedIcon />
            </Avatar>

            <Stack>
              <Typography variant="subtitle1" fontWeight={600} lineHeight={1.2}>
                {nombreCliente || "Sin nombre"}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <CallOutlinedIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {telefonoCliente || "Sin teléfono"}
                </Typography>
              </Stack>
            </Stack>

            <BitacoraBtn
              onClick={() => setIsBitacoraOpen(true)}
              sx={{
                bgcolor: "#eef1f6",
                color: "#5b4bb8",
                "&:hover": { bgcolor: "#e3e7f5" },
              }}
            />
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Box>
            <FieldLabel htmlFor="fecha-cita-input">Fecha</FieldLabel>
            <TextField
              name="fecha"
              type="date"
              id="fecha-cita-input"
              variant="outlined"
              size="small"
              value={formatDateToHTML(citaForm.fecha)}
              onChange={(e) => handleChangeFecha(e.target.value)}
              sx={[compactFieldSx, { width: 170 }]}
            />
          </Box>

          <Box flexGrow={1} />

          <ToggleButtonGroup
            color="primary"
            value={view}
            exclusive
            onChange={handleAlignmentChange}
            aria-label="Platform"
            size="small"
          >
            <ToggleButton value="servicio">Servicio</ToggleButton>
            <ToggleButton value="total">Total Cita</ToggleButton>
          </ToggleButtonGroup>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={3}
          py={1.5}
          sx={(theme) => ({
            bgcolor: theme.palette.action.hover,
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              TOTAL CITA
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              ${totalACobrar.toFixed(2)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1.5}>
            <Button
              size="small"
              startIcon={<VolunteerActivismOutlinedIcon />}
              onClick={() => setIsPropinaOpen(true)}
              sx={{ borderRadius: 5 }}
              variant="outlined"
              color="secondary"
            >
              {totalPropinas > 0
                ? `Propina · $${totalPropinas.toFixed(2)}`
                : "Propina"}
            </Button>
            <StatusCitaChip
              hideLabel
              size="small"
              ctxValue={citaForm.estado}
              ctxDispatch={(field, value) =>
                setCitaForm((prev) => ({ ...prev, [field]: value }))
              }
            />
          </Stack>
        </Box>

        {/* La vista Servicio maneja su propio padding (dos columnas). "&&"
            gana en especificidad al padding del BootstrapDialog. */}
        <DialogContent
          dividers
          sx={view === "servicio" ? { "&&": { p: 0 } } : undefined}
        >
          {view === "servicio" ? (
            <ServicioForm
              key={resolvedServicio.cellID}
              servicio={resolvedServicio}
              citaForm={citaForm}
              setCitaForm={setCitaForm}
              guardarProductos={guardarProductos}
              updateServicioInCita={updateServicioInCita}
              handleRemoveService={handleRemoveService}
            />
          ) : (
            <TotalCitaTbls
              cita={cita}
              citas={citas}
              propinas={propinasDelDia}
              onEditServicio={handleEditServicioFromTotal}
              onDeleteServicio={handleDeleteServicioFromTotal}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ gap: 1.5 }}>
          <Button onClick={handleCancelar}>Cancelar</Button>
          {view === "total" ? (
            <Button
              onClick={handleAbrirCobro}
              variant="contained"
              color="success"
              disabled={isSaving}
              aria-haspopup="dialog"
            >
              Cobrar ✓
            </Button>
          ) : (
            <Button
              autoFocus
              onClick={() => handleGuardar()}
              variant="contained"
              disabled={isSaving}
            >
              Guardar
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
      <Popover
        open={!!cobrarAnchorEl}
        anchorEl={cobrarAnchorEl}
        onClose={() => setCobrarAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { mt: -1.5, p: 2.25, width: 340, borderRadius: 3.5 },
            role: "dialog",
            "aria-label": "Método de pago",
          },
        }}
      >
        <Stack spacing={1.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography fontWeight={700}>¿Cómo pagó?</Typography>
            <Typography variant="caption" color="text.secondary">
              A cobrar{" "}
              <Box component="b" sx={{ color: "text.primary", fontSize: 15 }}>
                ${(totalACobrar + totalPropinasDelDia).toFixed(2)}
              </Box>
            </Typography>
          </Stack>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={metodoCobro}
            onChange={(_e, nuevo: string | null) => nuevo && setMetodoCobro(nuevo)}
            aria-label="Método de pago"
            sx={{
              gap: 1,
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid #e3e5e8",
                borderRadius: "10px !important",
                m: 0,
              },
            }}
          >
            {METODOS_DE_PAGO.map(({ value, label, Icon }) => (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  flexDirection: "column",
                  gap: 0.5,
                  py: 1.25,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 12.5,
                  bgcolor: "#fafafa",
                  "&.Mui-selected": {
                    bgcolor: "#e7f1fe",
                    color: "primary.dark",
                    borderColor: "primary.main !important",
                  },
                }}
              >
                <Icon fontSize="small" />
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => setCobrarAnchorEl(null)} color="inherit">
              Volver
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmarCobro}
              disabled={isSaving}
            >
              Confirmar cobro
            </Button>
          </Stack>
        </Stack>
      </Popover>
      <CambiosSinGuardarDialog
        open={isConfirmCerrarOpen}
        isSaving={isSaving}
        onSeguirEditando={() => setIsConfirmCerrarOpen(false)}
        onDescartar={handleCancelar}
        onGuardar={handleGuardarDesdeConfirmacion}
      />
      <BitacoraModal
        isOpen={isBitacoraOpen}
        onClose={() => setIsBitacoraOpen(false)}
        cliente={{
          id: clienteId,
          nombre: nombreCliente,
          telefono: telefonoCliente || "",
          correo: "",
          lastVisit: "",
        }}
      />
      {isPropinaOpen && (
        <PropinaModal
          open={isPropinaOpen}
          onClose={() => setIsPropinaOpen(false)}
          propinas={citaForm.propinas || []}
          onAplicar={(propinas) =>
            setCitaForm((prev) => ({ ...prev, propinas }))
          }
          servicios={citaForm.servicios}
          productos={citaForm.productos}
          metodoDePagoDefault={citaForm.metodoDePago || "efectivo"}
          totalCita={totalACobrar}
        />
      )}
    </>
  );
}
