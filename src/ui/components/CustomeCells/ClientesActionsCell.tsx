import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditClienteModal from "../modals/clientes/EditClienteModal";
import ElimClienteModal from "../modals/clientes/ElimClienteModal";
import BitacoraBtn from "../buttons/BitacoraBtn";
// import BitacoraModal from "../modals/clientes/BitacoraModal";

function ClientesActionsCell(params: any) {
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

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
        <BitacoraBtn onClick={handleBitacoraClick} />
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
      {/* <BitacoraModal
        open={isBitacoraOpen}
        onClose={() => setIsBitacoraOpen(false)}
        cliente={params.data}
      /> */}
    </>
  );
}

export default ClientesActionsCell;
