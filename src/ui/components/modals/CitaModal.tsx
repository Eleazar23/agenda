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

const CustomeInputField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    textTransform: "capitalize",
  },
}));

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
      console.log("Error al agregar cliente", "error");
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
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <CustomeInputField
            name="fecha"
            type="date"
            id="filled-basic"
            label="Fecha"
            variant="filled"
            size="small"
            value={formatDateToHTML(citaForm.fecha)}
            onChange={(e) => handleChangeFecha(e.target.value)}
            sx={{ maxWidth: 190 }}
          />

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

        <DialogContent dividers>
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

        <DialogActions>
          <Button
            startIcon={<VolunteerActivismOutlinedIcon />}
            color="secondary"
            onClick={() => setIsPropinaOpen(true)}
            sx={{ mr: "auto" }}
          >
            {totalPropinas > 0
              ? `Propina · $${totalPropinas.toFixed(2)}`
              : "Propina"}
          </Button>
          <Button autoFocus onClick={handleCancelar}>
            Cancelar
          </Button>
          {view === "total" ? (
            <Button
              onClick={() => handleGuardar({ estado: "pagado" })}
              variant="contained"
              color="success"
              disabled={isSaving}
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
      <CambiosSinGuardarDialog
        open={isConfirmCerrarOpen}
        isSaving={isSaving}
        onSeguirEditando={() => setIsConfirmCerrarOpen(false)}
        onDescartar={handleCancelar}
        onGuardar={handleGuardarDesdeConfirmacion}
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
