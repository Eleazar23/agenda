import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditClienteModal from "../modals/clientes/EditClienteModal";
import ElimClienteModal from "../modals/clientes/ElimClienteModal";
import BitacoraBtn from "../buttons/BitacoraBtn";
import BitacoraModal from "../modals/clientes/BitacoraModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Cliente } from "../../types/Cliente";

function ClientesActionsCell(params: CustomCellRendererProps<Cliente>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);
  const [isBitacoraOpen, setIsBitacoraOpen] = useState(false);

  const handleEditClick = () => {
    console.log("Edit cliente button clicked", params);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    console.log("Delete cliente button clicked", params);
    setIsEliminar(true);
  };

  const handleBitacoraClick = () => {
    console.log("Bitacora button clicked", params);
    setIsBitacoraOpen(true);
  };

  if (!params.data) return null;

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
        <BitacoraBtn onClick={handleBitacoraClick} />
      </Box>
      <EditClienteModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <ElimClienteModal
        isOpen={isEliminar}
        onClose={() => setIsEliminar(false)}
        clienteData={params.data}
      />
      <BitacoraModal
        isOpen={isBitacoraOpen}
        onClose={() => setIsBitacoraOpen(false)}
        cliente={params.data}
      />
    </>
  );
}

export default ClientesActionsCell;
