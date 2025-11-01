import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useAgendaContext } from "../contexts/AgendaContext";
import { Grid, TextField } from "@mui/material";
import { Gif } from "@mui/icons-material";
import StatusCita from "./Inputs/StatusCita";

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

export default function CitaModal() {
  const { agendaData, setAgendaData } = useAgendaContext();
  const { isCitaOpen, modal } = agendaData;

  const handleClickOpen = () => {
    // setOpen(true);
    setAgendaData({ ...agendaData, isCitaOpen: true });
  };
  const handleClose = () => {
    // setOpen(false);
    setAgendaData({ ...agendaData, isCitaOpen: false, modal: null });
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isCitaOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {modal ? modal?.cliente.nombre : ""} - {modal?.cliente.phone}
        </DialogTitle>
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
          <Grid container spacing={2}>
            <CustomeInputField
              id="outlined-basic"
              label="Estilista"
              variant="filled"
              value={modal?.servicio.estilista}
            />
            <CustomeInputField
              id="outlined-basic"
              label="Servicio"
              variant="filled"
              value={modal?.servicio.servicio}
            />
            <CustomeInputField
              id="outlined-basic"
              label="Duracion"
              variant="filled"
              value={modal?.servicio.duracion}
            />
            <StatusCita sx={{width: "50%"}} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancelar
          </Button>
          <Button autoFocus onClick={handleClose} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
