import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteBtn from "../buttons/DeleteBtn";
import { useNotasCtx } from "../../contexts/NotasCtx";
import NotaModal from "../modals/NotaModal";
import { Nota } from "../../types/Nota";

const NotasPanel = () => {
  const { dataTable, toggleNotaEstado, removeNota, toggleNotasOpen } = useNotasCtx();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState<Nota | undefined>();
  const [notaToDelete, setNotaToDelete] = useState<Nota | undefined>();

  const handleOpenModal = () => {
    setEditingNota(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNota(undefined);
  };

  const handleEditNota = (nota: Nota) => {
    setEditingNota(nota);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (notaToDelete) {
      await removeNota(notaToDelete.id);
      setNotaToDelete(undefined);
    }
  };

  return (
    <Paper elevation={1} sx={{ height: "100%", width: "100%", p: 2, display: "flex", flexDirection: "column", position: "relative" }}>
      <IconButton
        size="small"
        aria-label="cerrar notas"
        onClick={toggleNotasOpen}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Notas</Typography>
        <Button variant="contained" size="small" onClick={handleOpenModal} sx={{ mr: 4 }}>
          Agregar Nota
        </Button>
      </Stack>

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <List dense>
          {dataTable.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No hay notas registradas.
            </Typography>
          )}
          {dataTable.map((nota) => (
            <ListItem
              key={nota.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label="editar"
                    onClick={() => handleEditNota(nota)}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <DeleteBtn onClick={() => setNotaToDelete(nota)} />
                </>
              }
              disablePadding
              sx={{ py: 0.5 }}
            >
              <Checkbox
                edge="start"
                checked={nota.estado}
                onChange={() => toggleNotaEstado(nota)}
              />
              <ListItemText
                primary={nota.nota}
                secondary={nota.estilistaNombre}
                sx={{
                  textDecoration: nota.estado ? "line-through" : "none",
                  color: nota.estado ? "text.secondary" : "text.primary",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <NotaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialNota={editingNota}
      />

      <Dialog open={!!notaToDelete} onClose={() => setNotaToDelete(undefined)}>
        <DialogTitle>¿Estás seguro de eliminar esta nota?</DialogTitle>
        <DialogContent>
          <DialogContentText>{notaToDelete?.nota}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotaToDelete(undefined)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NotasPanel;
