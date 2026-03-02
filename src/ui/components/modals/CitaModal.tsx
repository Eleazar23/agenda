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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAgendaContext } from "../../contexts/AgendaContext";
import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import StatusCita from "../Inputs/StatusCita";
import PrecioInput from "../Inputs/PrecioInput";
import HoraInput from "../Inputs/HoraInput";
import MetodoPagoInput from "../Inputs/MetodoPagoInput";
import EstilistaInput from "../Inputs/EstilistaInput";
import ServiciosInput from "../Inputs/ServiciosInput";
import {
  formatDateFromHTML,
  formatDateToHTML,
  getDuracion,
} from "../../utils/utils";
import { Cita } from "../../types/Cita";
import { getHrsObj } from "../../utils/utils";
import IconText from "../IconText";
//Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ProductsCar from "../tables/ProductsCar";
import Cantidad from "../Inputs/Cantidad";
import AddProductForm from "../forms/AddProductForm";
import Servicio from "./cita/Servicio";
import TotalCitaTbl from "../tables/TotalCitaTbl";

type CitaModalProps = {
  cita: Cita;
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

export default function CitaModal({ cita }: CitaModalProps) {
  // const { agendaData, setAgendaData } = useAgendaContext();
  const { isCitaOpen, setIsCitaOpen, handleEditCita } = useAgendaContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [productos, setProductos] = useState([
    { nombre: "Shampoo", precio: 10, cantidad: 2 },
    { nombre: "Acondicionador", precio: 15, cantidad: 1 },
    { nombre: "Mascarilla", precio: 20, cantidad: 1 },
    { nombre: "Spray", precio: 12, cantidad: 3 },
    { nombre: "Gel", precio: 8, cantidad: 2 },
  ]);
  const [modalForm, setModalForm] = useState(
    cita || {
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
    },
  );
  const [view, setView] = useState("servicio");

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
    setModalForm({ ...cita });
    setIsEditMode(false);
    setIsCitaOpen(false);
  };

  const handleClose = () => {
    setModalForm({ ...cita });
    setIsEditMode(false);
    setIsCitaOpen(false);
  };

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleGuardar = () => {
    // Guardar los cambios realizados en el modal
    // console.log({ modalForm, agendaData })
    // setAgendaData({ ...agendaData, isCitaOpen: false, modal: modalForm });
    if (cita && cita.id !== undefined) {
      handleEditCita(cita.id, modalForm);
    }
    setIsEditMode(false);
    setIsCitaOpen(false);
  };

  const handleDuracionChange = () => {
    const newDuracion = getDuracion(modalForm.horaInicio, modalForm.horaFin);
    setModalForm({
      ...modalForm,
      duracion: newDuracion,
    });
  };

  useEffect(() => {
    handleDuracionChange();
  }, [modalForm.horaInicio, modalForm.horaFin]);

  const handleChange = (inputName: string, value: any) => {
    console.log({ modalForm, inputName, value });
    const newRowIndex = getHrsObj(modalForm.horaInicio)?.index;
    setModalForm({
      ...modalForm,
      [inputName]: value,
      rowIndex: newRowIndex,
    });
  };

  const handleChangeFecha = (newDate: string) => {
    const fomattedDate = formatDateFromHTML(newDate);
    setModalForm({
      ...modalForm,
      fecha: fomattedDate,
    });
    console.log({ modalForm });
  };

  useEffect(() => {
    if (cita) {
      setModalForm({ ...cita });
      setIsEditMode(false);
    }
  }, [cita]);

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
              label={modalForm.nombreCliente}
            />
            <IconText
              icon={<CallOutlinedIcon />}
              label={modalForm.telefonoCliente}
            />
            <CustomeInputField
              name="fecha"
              type="date"
              id="filled-basic"
              label="Fecha"
              variant="filled"
              fullWidth
              value={formatDateToHTML(modalForm.fecha || "")}
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
              <ToggleButton value="total">Total</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box component={"div"} display="flex">
            <IconButton
              aria-label="edit"
              onClick={handleToggleEdit}
              sx={(theme) => ({
                position: "absolute",
                right: 56,
                top: 8,
                color: isEditMode
                  ? theme.palette.primary.main
                  : theme.palette.grey[500],
              })}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <DialogContent dividers>
          {view === "servicio" ? <Servicio /> : <TotalCitaTbl />}
        </DialogContent>

        <DialogActions>
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
