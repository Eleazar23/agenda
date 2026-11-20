import { Typography } from "@mui/material";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { useProductosCtx } from "../../../contexts/ProductosCtx";
import { Producto } from "../../../types/Producto";
import { formatMoney } from "../../../utils/utils";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  productoData?: Producto;
};

function ElimProductoModal({ isOpen, onClose, productoData }: Props) {
  const { removeProducto } = useProductosCtx();

  const handleDelete = () => {
    if (productoData && productoData.id) {
      removeProducto(productoData.id);
    }
    onClose?.();
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Producto"
      confirmQuestion="¿Estás seguro de que deseas eliminar este producto?"
      onConfirm={handleDelete}
      itemSummary={
        productoData && (
          <>
            <Typography variant="subtitle2" fontWeight="bold">
              {productoData.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Marca: {productoData.marca}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Precio: {formatMoney(productoData.precio)}
            </Typography>
            {productoData.stock !== undefined && (
              <Typography variant="body2" color="text.secondary">
                Stock: {productoData.stock}
              </Typography>
            )}
          </>
        )
      }
    />
  );
}

export default ElimProductoModal;
