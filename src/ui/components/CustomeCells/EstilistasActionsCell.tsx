import { useState } from "react";
import EntityActionsCell from "./EntityActionsCell";
import VacacionesBtn from "../buttons/VacacionesBtn";
import EditEstilistasModal from "../modals/EditEstilistaModal";
import VacacionesModal from "../modals/VacacionesModal";
import ElimEstilistaModal from "../modals/ElimEstilistaModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Estilista } from "../../types/Estilista";

function EstilistasActionsCell(params: CustomCellRendererProps<Estilista>) {
  const [isVacaciones, setIsVacaciones] = useState(false);

  if (!params.data) return null;
  const estilista = params.data;
  const rowIndex = params.node.rowIndex ?? 0;

  return (
    <EntityActionsCell
      renderEditModal={(isOpen, onClose) => (
        <EditEstilistasModal
          rowIndex={rowIndex}
          isOpen={isOpen}
          onClose={onClose}
          initialData={estilista}
        />
      )}
      renderDeleteModal={(isOpen, onClose) => (
        <ElimEstilistaModal
          isOpen={isOpen}
          onClose={onClose}
          estilistaData={estilista}
        />
      )}
      extra={
        <>
          <VacacionesBtn onClick={() => setIsVacaciones(true)} />
          <VacacionesModal
            rowIndex={rowIndex}
            isOpen={isVacaciones}
            onClose={() => setIsVacaciones(false)}
            estilistaData={estilista}
          />
        </>
      }
    />
  );
}

export default EstilistasActionsCell;
