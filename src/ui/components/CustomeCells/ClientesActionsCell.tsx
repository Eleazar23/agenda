import { useState } from "react";
import EntityActionsCell from "./EntityActionsCell";
import EditClienteModal from "../modals/clientes/EditClienteModal";
import ElimClienteModal from "../modals/clientes/ElimClienteModal";
import BitacoraBtn from "../buttons/BitacoraBtn";
import BitacoraModal from "../modals/clientes/BitacoraModal";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Cliente } from "../../types/Cliente";

function ClientesActionsCell(params: CustomCellRendererProps<Cliente>) {
  const [isBitacoraOpen, setIsBitacoraOpen] = useState(false);

  if (!params.data) return null;
  const cliente = params.data;

  return (
    <EntityActionsCell
      renderEditModal={(isOpen, onClose) => (
        <EditClienteModal
          isOpen={isOpen}
          onClose={onClose}
          initialData={cliente}
        />
      )}
      renderDeleteModal={(isOpen, onClose) => (
        <ElimClienteModal
          isOpen={isOpen}
          onClose={onClose}
          clienteData={cliente}
        />
      )}
      extra={
        <>
          <BitacoraBtn onClick={() => setIsBitacoraOpen(true)} />
          <BitacoraModal
            isOpen={isBitacoraOpen}
            onClose={() => setIsBitacoraOpen(false)}
            cliente={cliente}
          />
        </>
      }
    />
  );
}

export default ClientesActionsCell;
