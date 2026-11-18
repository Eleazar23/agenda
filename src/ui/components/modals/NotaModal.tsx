import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import NotaForm from "../forms/NotaForm";
import { useNotasCtx } from "../../contexts/NotasCtx";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Nota } from "../../types/Nota";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialNota?: Nota;
};

const NotaModal = ({ isOpen, onClose, initialNota }: Props) => {
  const { addNota, editNota } = useNotasCtx();
  const { fecha } = useAgendaContext();

  const handleSubmit = async (nota: Omit<Nota, "id"> & { id?: number }) => {
    try {
      if (initialNota) {
        await editNota({ ...nota, id: initialNota.id });
      } else {
        const { id, ...notaWithoutId } = nota;
        await addNota(notaWithoutId);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting nota:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialNota ? "Editar Nota" : "Agregar Nueva Nota"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <NotaForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialNota}
          fechaDefault={fecha}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NotaModal;
