import EntityActionsCell from "./EntityActionsCell";
import EditServicioModal from "../modals/servicios/EditServicioModal";
import ElimServicioModal from "../modals/servicios/ElimServicioModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Servicio } from "../../types/Servicio";

function ServiciosActionsCell(params: CustomCellRendererProps<Servicio>) {
  if (!params.data) return null;
  const servicio = params.data;

  return (
    <EntityActionsCell
      renderEditModal={(isOpen, onClose) => (
        <EditServicioModal
          isOpen={isOpen}
          onClose={onClose}
          initialData={servicio}
        />
      )}
      renderDeleteModal={(isOpen, onClose) => (
        <ElimServicioModal
          isOpen={isOpen}
          onClose={onClose}
          servicioData={servicio}
        />
      )}
    />
  );
}

export default ServiciosActionsCell;
