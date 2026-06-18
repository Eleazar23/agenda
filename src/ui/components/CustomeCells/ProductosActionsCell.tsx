import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditProductoModal from "../modals/productos/EditProductoModal";
import ElimProductoModal from "../modals/productos/ElimProductoModal";

function ProductosActionsCell(params: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);

  const handleEditClick = () => {
    console.log("Edit producto button clicked", params);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    console.log("Delete producto button clicked", params);
    setIsEliminar(true);
  };
  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
      </Box>
      <EditProductoModal
        rowIndex={params.node.rowIndex}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <ElimProductoModal
        isOpen={isEliminar}
        onClose={() => setIsEliminar(false)}
        productoData={params.data}
      />
    </>
  );
}

export default ProductosActionsCell;
