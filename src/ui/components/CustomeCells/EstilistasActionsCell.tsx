import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import VacacionesBtn from "../buttons/VacacionesBtn";
import EditEstilistasModal from "../modals/EditEstilistaModal";
import VacacionesModal from "../modals/VacacionesModal";
import ElimEstilistaModal from "../modals/ElimEstilistaModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Estilista } from "../../types/Estilista";

function EstilistasActionsCell(params: CustomCellRendererProps<Estilista>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEliminar, setIsEliminar] = useState(false);
  const [isVacaciones, setIsVacaciones] = useState(false);
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

  if (!params.data) return null;
  const rowIndex = params.node.rowIndex ?? 0;

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <VacacionesBtn onClick={() => setIsVacaciones(true)} />
        <DeleteBtn
          onClick={() => setIsEliminar(true)}
        />
      </Box>
      <EditEstilistasModal
        rowIndex={rowIndex}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={params.data}
      />
      <VacacionesModal
        rowIndex={rowIndex}
        isOpen={isVacaciones}
        onClose={() => setIsVacaciones(false)}
        estilistaData={params.data}
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
