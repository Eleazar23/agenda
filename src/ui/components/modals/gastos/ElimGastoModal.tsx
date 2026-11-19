import { Typography } from "@mui/material";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { Gasto } from "../../../types/Gasto";
import { useGastosCtx } from "../../../contexts/GastosCtx";

interface ElimGastoProps {
  gastoData?: Gasto;
  open: boolean;
  onClose: () => void;
}

function ElimGastoModal({ gastoData, open, onClose }: ElimGastoProps) {
  const { removeGasto } = useGastosCtx();

  const handleDelete = () => {
    if (gastoData && gastoData.id) {
      removeGasto(gastoData.id);
    }
    onClose?.();
  };

  return (
    <ConfirmDeleteModal
      isOpen={open}
      onClose={onClose}
      title="Eliminar Gasto"
      confirmQuestion="¿Estás seguro de que deseas eliminar este gasto?"
      onConfirm={handleDelete}
      itemSummary={
        gastoData && (
          <>
            <Typography variant="subtitle2" fontWeight="bold">
              {gastoData.proveedorNombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monto: ${gastoData.monto}
            </Typography>
          </>
        )
      }
    />
  );
}

export default ElimGastoModal;
