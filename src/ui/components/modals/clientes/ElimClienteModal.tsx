import React from "react";
import { Typography } from "@mui/material";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { useClientesCtx } from "../../../contexts/ClientesCtx";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo?: string;
  lastVisit?: string;
}

interface ElimClienteModalProps {
  isOpen: boolean;
  onClose?: () => void;
  clienteData?: Cliente;
}

const ElimClienteModal: React.FC<ElimClienteModalProps> = ({
  isOpen,
  onClose,
  clienteData,
}) => {
  const { removeCliente } = useClientesCtx();

  const handleConfirmDelete = () => {
    if (clienteData) {
      removeCliente(clienteData.id);
      onClose?.();
    }
  };

  if (!clienteData) return null;

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Cliente"
      confirmQuestion="¿Estás seguro de que deseas eliminar al cliente?"
      onConfirm={handleConfirmDelete}
      itemSummary={
        <>
          <Typography variant="subtitle2" fontWeight="bold">
            {clienteData.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Teléfono: {clienteData.telefono}
          </Typography>
        </>
      }
    />
  );
};

export default ElimClienteModal;
