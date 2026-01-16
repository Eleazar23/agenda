import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditClienteModal from "../modals/clientes/EditClienteModal";
import ElimClienteModal from "../modals/clientes/ElimClienteModal";

interface Cliente {
  id?: string;
  nombre: string;
  phone: string;
  correo?: string;
}

function ClientesActionsCell(params: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);

  const handleEditClick = () => {
    console.log("Edit cliente button clicked", params);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    console.log("Delete cliente button clicked", params);
    setIsEliminar(true);
  };

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
      </Box>
      <EditClienteModal
        rowIndex={params.node.rowIndex}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <ElimClienteModal
        isOpen={isEliminar}
        onClose={() => setIsEliminar(false)}
        clienteData={params.data}
      />
    </>
  );
}

export default ClientesActionsCell;
