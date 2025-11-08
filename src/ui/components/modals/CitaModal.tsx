import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Box, Divider, Grid, Stack, TextField } from "@mui/material";
import StatusCita from "../Inputs/StatusCita";
import PrecioInput from "../Inputs/PrecioInput";
import HoraInput from "../Inputs/HoraInput";
import MetodoPagoInput from "../Inputs/MetodoPagoInput";

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
  const [modalForm, setModalForm] = useState({
    ...modal?.cliente,
    ...modal?.servicio,
  });
  console.log({ modalForm, modal });

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
        fullWidth
        maxWidth="md"
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
                  <CustomeInputField
                    id="outlined-basic"
                    label="Estilista"
                    variant="filled"
                    value={modal?.servicio.estilista}
                  />
                  <Grid container spacing={1}>
                    <Grid size={7}>
                      <CustomeInputField
                        id="outlined-basic"
                        label="Servicio"
                        variant="filled"
                        value={modal?.servicio.servicio}
                        fullWidth
                      />
                    </Grid>
                    <Grid container alignItems={"center"} size={5}>
                      <Grid size={12}>
                        <PrecioInput />
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
                    />
                  </Grid>
                  <Grid container spacing={1} flexGrow={1}>
                    <Grid size={6}>
                      <HoraInput />
                    </Grid>
                    <Grid size={6}>
                      <CustomeInputField
                        id="outlined-basic"
                        variant="filled"
                        label="Duracion"
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid size={6} sx={{ height: "100%" }} flexGrow={1}>
                <Stack spacing={1}>
                  <Grid container spacing={2} flexGrow={1} direction={"column"}>
                    <Grid flexGrow={1}>
                      <StatusCita fullWidth />
                    </Grid>
                    <Grid flexGrow={1}>
                      <MetodoPagoInput />
                    </Grid>
                  </Grid>
                  <Divider flexItem />
                  <TextField
                    label="Notas"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={5}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
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
