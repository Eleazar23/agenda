import EntityActionsCell from "./EntityActionsCell";
import EditProductoModal from "../modals/productos/EditProductoModal";
import ElimProductoModal from "../modals/productos/ElimProductoModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Producto } from "../../types/Producto";

function ProductosActionsCell(params: CustomCellRendererProps<Producto>) {
  if (!params.data) return null;
  const producto = params.data;

  return (
    <EntityActionsCell
      renderEditModal={(isOpen, onClose) => (
        <EditProductoModal
          isOpen={isOpen}
          onClose={onClose}
          initialData={producto}
        />
      )}
      renderDeleteModal={(isOpen, onClose) => (
        <ElimProductoModal
          isOpen={isOpen}
          onClose={onClose}
          productoData={producto}
        />
      )}
    />
  );
}

export default ProductosActionsCell;
