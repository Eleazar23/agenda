import { Typography } from "@mui/material";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { useServiciosCtx } from "../../../contexts/ServiciosContext";
import { Servicio } from "../../../types/Servicio";
import { formatMoney } from "../../../utils/utils";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  servicioData?: Servicio;
};

function ElimServicioModal({ isOpen, onClose, servicioData }: Props) {
  const { removeServicio } = useServiciosCtx();

  const handleDelete = () => {
    if (servicioData && servicioData.id) {
      removeServicio(servicioData.id);
    }
    onClose?.();
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Servicio"
      confirmQuestion="¿Estás seguro de que deseas eliminar este servicio?"
      onConfirm={handleDelete}
      itemSummary={
        servicioData && (
          <>
            <Typography variant="subtitle2" fontWeight="bold">
              {servicioData.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Precio: {formatMoney(servicioData.precio)}
            </Typography>
          </>
        )
      }
    />
  );
}

export default ElimServicioModal;
