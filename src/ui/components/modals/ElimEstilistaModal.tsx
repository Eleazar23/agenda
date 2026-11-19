import * as React from "react";
import { Typography } from "@mui/material";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { capitalizeFirstLetter } from "../../utils/utils";

type Estilista = {
  id: number;
  name: string;
  telefono: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  estilistaData: Estilista;
};

export default function ElimEstilistaModal({
  isOpen,
  onClose,
  estilistaData,
}: Props) {
  const { removeEstilista } = useEstilistasCtx();

  const handleConfirmDelete = () => {
    removeEstilista(estilistaData.id);
    onClose();
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Estilista"
      confirmQuestion="¿Estás seguro de que deseas eliminar este estilista?"
      onConfirm={handleConfirmDelete}
      itemSummary={
        <>
          <Typography variant="subtitle2" fontWeight="bold">
            {capitalizeFirstLetter(estilistaData.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Teléfono: {estilistaData.telefono}
          </Typography>
        </>
      }
    />
  );
}
