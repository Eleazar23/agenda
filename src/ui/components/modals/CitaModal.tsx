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
  Box,
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
import IconText from "../IconText";
//Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
// import Servicio from "./cita/Servicio";
import TotalCitaTbls from "../tables/TotalCitaTbls";
import ServicioForm from "./cita/Servicio";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { Producto, ProductoInCita } from "../../types/Producto";
import { getCitasByFechaCliente } from "../../services/citasApi";

type CitaModalProps = {
  fecha: string;
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
  // const { isCitaOpen, setIsCitaOpen, handleEditCita } = useAgendaContext();
  const { handleEditCita } = useAgendaContext();
  // const { isCitaOpen, setIsCitaOpen } = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false);
  const [view, setView] = useState("servicio");
  const [productosToUpdate, setProductosToUpdate] = useState<ProductoInCita[]>([]);
  const [citaForm, setCitaForm] = useState<Cita>(
    cita || {
      id: "",
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

  // const totalCita =
  //   citaForm.servicios.reduce((acumulador, servicio) => {
  //     return acumulador + Number(servicio.servicio.precio);
  //   }, 0) +
  //   citaForm.productos.reduce((acumulador, producto) => {
  //     return acumulador + Number(producto.precio) * Number(producto.cantidad);
  //   }, 0);

  const getCitaData = async () => {
    try {
      const citaData = await window.api.getCitaByFechaCliente(
        fecha,
        nombreCliente,
      );
      setCita(() => citaData);
      setCitaForm((prev) => ({ ...prev, ...citaData }));
    } catch (error) {
      console.log("Error al agregar cliente", "error");
    }
  };

  const getCitasData = async () => {
    const citasData = await getCitasByFechaCliente(fecha, nombreCliente);
    console.log({ citasData });
    setCitas((prev) => [...prev, ...citasData]);
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
    console.log({ citaForm, productosToUpdate });
    await handleEditCita(citaForm.id, citaForm, productosToUpdate);
    setProductosToUpdate([]); // Reiniciar el array después de guardar los cambios
  };

  const updateProductosInCita = (newProductos: Array<ProductoInCita>) => {
    setCitaForm((prev) => ({
      ...prev,
      productos: newProductos,
    }));
  };

  const updateServicioInCita = (updatedServicio: ServicioAgendado) => {
    // const newHr = getHrsObj(updatedServicio.horaInicio);
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

  // const handleDuracionChange = () => {
  //   const newDuracion = getDuracion(citaForm.horaInicio, citaForm.horaFin);
  //   setCitaForm({
  //     ...citaForm,
  //     duracion: newDuracion,
  //   });
  // };

  // useEffect(() => {
  //   handleDuracionChange();
  // }, [modalForm.horaInicio, modalForm.horaFin]);

  useEffect(() => {
    getCitaData();
    getCitasData();
  }, []);

  // const handleChange = (inputName: string, value: any) => {
  //   console.log({ modalForm, inputName, value });
  //   const newRowIndex = getHrsObj(modalForm.horaInicio)?.index;
  //   setModalForm({
  //     ...modalForm,
  //     [inputName]: value,
  //     rowIndex: newRowIndex,
  //   });
  // };

  const handleChangeFecha = (newDate: string) => {
    const fomattedDate = formatDateFromHTML(newDate);
    setCitaForm({
      ...citaForm,
      fecha: fomattedDate,
    });
  };

  // useEffect(() => {
  //   if (servicio) {
  //     // setModalForm({ ...cita });
  //     setIsEditMode(false);
  //   }
  // }, [servicio]);

  return (
    <>
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isCitaOpen}
      >
        <Box display="flex" justifyContent="space-between" margin={2}>
          <Box
            component="div"
            display="flex"
            justifyContent="flex-start"
            alignContent="center"
            gap={2}
          >
            <IconText
              icon={<AccountCircleOutlinedIcon />}
              label={nombreCliente || "Sin nombre"}
            />
            <IconText
              icon={<CallOutlinedIcon />}
              label={telefonoCliente || "Sin teléfono"}
            />
            <CustomeInputField
              name="fecha"
              type="date"
              id="filled-basic"
              label="Fecha"
              variant="filled"
              fullWidth
              value={formatDateToHTML(citaForm.fecha)}
              onChange={(e) => handleChangeFecha(e.target.value)}
            />
            <ToggleButtonGroup
              color="primary"
              value={view}
              exclusive
              onChange={handleAlignmentChange}
              aria-label="Platform"
            >
              <ToggleButton value="servicio">Servicio</ToggleButton>
              <ToggleButton value="total">Total Cita</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box component={"div"} display="flex">
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
          {/* <Typography variant="h6" fontWeight="bold">
            {`Total Cita: $${totalCita}`}
          </Typography> */}
          <Button autoFocus onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button autoFocus onClick={handleGuardar} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
