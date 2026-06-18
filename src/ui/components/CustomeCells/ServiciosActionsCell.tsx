import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditServicioModal from "../modals/servicios/EditServicioModal";
import ElimServicioModal from "../modals/servicios/ElimServicioModal";

function ServiciosActionsCell(params: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);

  const handleEditClick = () => {
    console.log("Edit servicio button clicked", params);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    console.log("Delete servicio button clicked", params);
    setIsEliminar(true);
  };

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
      </Box>
      <EditServicioModal
        rowIndex={params.node.rowIndex}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <ElimServicioModal
        isOpen={isEliminar}
        onClose={() => setIsEliminar(false)}
        servicioData={params.data}
      />
    </>
  );
}

export default ServiciosActionsCell;
