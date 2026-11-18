import { useState } from "react";
import { Box } from "@mui/material";
import { Gasto } from "../../types/Gasto";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
import ElimGastoModal from "../modals/gastos/ElimGastoModal";

type Props = {
  data: Gasto;
  onEdit?: (gasto: Gasto) => void;
};

const GastoActionsCell = ({ data, onEdit }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };

  return (
    <>
    <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
      <EditBtn onClick={handleEditClick} />
      <DeleteBtn onClick={handleOpenDeleteModal} />
    </Box>
    <ElimGastoModal
        gastoData={data}
        open={isDeleteModalOpen} // Controla esto con un estado si quieres mostrar el modal
        onClose={() => setIsDeleteModalOpen(false)} // Implementa la función para cerrar el modal
      />
    </>
  );
};

export default GastoActionsCell;
