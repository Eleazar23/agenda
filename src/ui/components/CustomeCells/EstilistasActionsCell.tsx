import React, { useEffect, useState } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import EditEstilistasModal from "../modals/EditEstilistaModal";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import ElimEstilistaModal from "../modals/ElimEstilistaModal";

function EstilistasActionsCell(params: any) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);
  const { dataTable, setDataTable } = useEstilistasCtx();

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleEditClick = () => {
    console.log("Edit button clicked", params);
    setIsEditing(true);
  };

  // const handleSaveModal = (estilista: any) => {
  //   const { rowIndex } = params.node;
  //   globalData.estilistas[rowIndex] = {
  //     ...globalData.estilistas[rowIndex],
  //     ...estilista,
  //   };
  //   setDataTable([...globalData.estilistas]);
  //   setIsEditing(false);
  //   handleAlert("Estilista actualizado con éxito", "success");
  // };

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn
          onClick={() => setIsEliminar(true)}
        />
      </Box>
      <EditEstilistasModal
        rowIndex={params.node.rowIndex}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <ElimEstilistaModal
        isOpen={isEliminar}
        onClose={() => setIsEliminar(false)}
        estilistaData={params.data}
      />
    </>
  );
}

export default EstilistasActionsCell;
