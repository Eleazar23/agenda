import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
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
  getDuracion,
  getOfficeHours,
} from "../../utils/utils";
import { Cita } from "../../types/Cita";
import { getHrs, getHrsObj } from "../../utils/utils";
//Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
// import Servicio from "./cita/Servicio";
import TotalCitaTbls from "../tables/TotalCitaTbls";
import ServicioForm from "./cita/Servicio";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { Producto, ProductoInCita } from "../../types/Producto";
import { getCitasByFechaClienteId } from "../../services/citasApi";

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
  const [totalCita, setTotalCita] = useState(0);
  const { handleEditCita } = useAgendaContext();
  const [view, setView] = useState("servicio");
  const [productosToUpdate, setProductosToUpdate] = useState<ProductoInCita[]>([]);
  const [isSaving, setIsSaving] = useState(false);
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
    },
  );

  const getCitaData = async () => {
    try {
      const citaData = await window.api.getCitaByFechaClienteId(
        fecha,
        clienteId,
      );
      setCita(() => citaData);
      setCitaForm((prev) => ({ ...prev, ...citaData }));
    } catch (error) {
      console.log("Error al agregar cliente", "error");
    }
  };

  const getCitasData = async () => {
    const citasData = await getCitasByFechaClienteId(fecha, clienteId);
    setCitas(citasData);
  };

  const handleRemoveService = (servicioToRemove: ServicioAgendado) => {
    const updatedServicios = citaForm.servicios.filter(
      (s) => s.cellID !== servicioToRemove.cellID,
    );
    const newCitaData = {
      ...citaForm,
      servicios: updatedServicios,
    };
    setCitaForm(newCitaData);
    console.log({ updatedServicios, citaForm });
    handleEditCita(citaForm.id, newCitaData, productosToUpdate);
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

  const handleCancelar = () => {
    setCitaForm((prev) => ({ ...prev, ...cita }));
    setIsCitaOpen(false);
  };

  const handleClose = () => {
    setIsCitaOpen(false);
  };

  const handleGuardar = async () => {
    if (isSaving) return;
    console.log({ citaForm, productosToUpdate });
    setIsSaving(true);
    try {
      await handleEditCita(citaForm.id, citaForm, productosToUpdate);
      setProductosToUpdate([]); // Reiniciar el array después de guardar los cambios
      setIsCitaOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProductosInCita = (newProductos: Array<ProductoInCita>) => {
    setCitaForm((prev) => ({
      ...prev,
      productos: newProductos,
    }));
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
                <CallOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
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
              servicio={servicio}
              citaForm={citaForm}
              setCitaForm={setCitaForm}
              updateProductosInCita={updateProductosInCita}
              updateServicioInCita={updateServicioInCita}
              handleRemoveService={handleRemoveService}
              productosToUpdate={productosToUpdate}
              setProductosToUpdate={setProductosToUpdate}
            />
          ) : (
            <TotalCitaTbls
              cita={cita}
              citas={citas}
              setTotalCita={setTotalCita}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button autoFocus onClick={handleGuardar} variant="contained" disabled={isSaving}>
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
