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
import { Box, Divider, Grid, Stack, TextField } from "@mui/material";
import StatusCita from "../Inputs/StatusCita";
import PrecioInput from "../Inputs/PrecioInput";
import HoraInput from "../Inputs/HoraInput";
import MetodoPagoInput from "../Inputs/MetodoPagoInput";
import EstilistaInput from "../Inputs/EstilistaInput";
import { formatDateFromHTML, formatDateToHTML, getDuracion } from "../../utils/utils";
import { Cita } from "../../types/Cita";
import { getHrsObj } from "../../utils/utils";

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
  const [modalForm, setModalForm] = useState(cita || {
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
      handleEditCita(cita.id, modalForm );
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
  }

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
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isCitaOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {modalForm.nombreCliente} - {modalForm.telefonoCliente}
        </DialogTitle>
        <IconButton
          aria-label="edit"
          onClick={handleToggleEdit}
          sx={(theme) => ({
            position: "absolute",
            right: 56,
            top: 8,
            color: isEditMode ? theme.palette.primary.main : theme.palette.grey[500],
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
        <DialogContent dividers>
          <Box component="div" display="flex" sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction={"row"}
              spacing={2}
              size={12}
              flexGrow={1}
            >
              <Grid size={5} flexGrow={1}>
                <Stack spacing={2}>
                  <EstilistaInput
                    ctxValue={modalForm.estilista}
                    ctxDispatch={handleChange}
                    readOnly={!isEditMode}
                  />
                  <Grid container spacing={1}>
                    <Grid size={7}>
                      <CustomeInputField
                        id="outlined-basic"
                        label="Servicio"
                        variant="filled"
                        value={modalForm.servicio?.nombre || ""}
                        fullWidth
                        slotProps={{
                          input: { readOnly: true }
                        }}
                      />
                    </Grid>
                    <Grid container alignItems={"center"} size={5}>
                      <Grid size={12}>
                        <PrecioInput value={modalForm.servicio.precio} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <CustomeInputField
                      name="fecha"
                      type="date"
                      id="outlined-basic"
                      label="Fecha"
                      variant="filled"
                      fullWidth
                      value={formatDateToHTML(modalForm.fecha || "")}
                      onChange={(e) =>
                        handleChangeFecha(e.target.value)
                      }
                      slotProps={{
                        input: { readOnly: !isEditMode }
                      }}
                    />
                  </Grid>
                  <Grid container spacing={1} flexGrow={1}>
                    <Grid size={6}>
                      <HoraInput 
                        label="Hora Inicio"
                        name="horaInicio"
                        hora={modalForm.horaInicio}
                        onChange={(newHora) => handleChange("horaInicio", newHora)}
                        readOnly={!isEditMode}
                      />
                    </Grid>
                    <Grid size={6}>
                      <HoraInput 
                        label="Hora Fin"
                        name="horaFin"
                        hora={modalForm.horaFin}
                        onChange={(newHora) => handleChange("horaFin", newHora)}
                        readOnly={!isEditMode}
                      />
                      {/* <CustomeInputField
                        type="number"
                        slotProps={{ htmlInput: { step: "30", min: "30" } }}
                        defaultValue={modalForm.duracion}
                        id="filled-basic-number-duracion"
                        variant="filled"
                        name="duracion"
                        label="Duracion"
                        onChange={(e) =>
                          handleChange("duracion", parseInt(e.target.value))
                        }
                      /> */}
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid size={6} sx={{ height: "100%" }} flexGrow={1}>
                <Stack spacing={1}>
                  <Grid container spacing={2} flexGrow={1} direction={"column"}>
                    <Grid flexGrow={1}>
                      <StatusCita
                        ctxDispatch={handleChange}
                        ctxValue={modalForm.estado}
                        readOnly={!isEditMode}
                      />
                    </Grid>
                    <Grid flexGrow={1}>
                      <MetodoPagoInput ctxDispatch={handleChange} ctxValue={modalForm.metodoDePago} readOnly={!isEditMode} />
                    </Grid>
                  </Grid>
                  <Divider flexItem />
                  <TextField
                    name="notas"
                    label="Notas"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={5}
                    value={modalForm.notas || ""}
                    onChange={(e) =>
                      handleChange("notas", e.target.value)
                    }
                    slotProps={{
                      input: { readOnly: !isEditMode }
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button 
            autoFocus 
            onClick={handleGuardar} 
            variant="contained"
            disabled={!isEditMode}
          >
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
