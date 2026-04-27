import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import GastoForm from "../forms/GastoForm";
import { useGastosCtx } from "../../contexts/GastosCtx";
import { Gasto } from "../../types/Gasto";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialGasto?: Gasto;
};

const GastoModal = ({ isOpen, onClose, initialGasto }: Props) => {
  const { addGasto, editGasto, dataTable } = useGastosCtx();

  const handleSubmit = async (gasto: Gasto) => {
    try {
      if (initialGasto) {
        // Editing mode - find the index of the gasto being edited
        const gastoIndex = dataTable.findIndex((g) => g.id === initialGasto.id);
        if (gastoIndex !== -1) {
          await editGasto(gastoIndex, gasto);
        }
      } else {
        // Adding mode - create a new gasto
        const { id, ...gastoWithoutId } = gasto;
        await addGasto({
          ...gastoWithoutId,
          id: 0, // Placeholder, will be replaced by backend
        } as Gasto);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting gasto:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialGasto ? "Editar Gasto" : "Agregar Nuevo Gasto"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <GastoForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialGasto}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GastoModal;
