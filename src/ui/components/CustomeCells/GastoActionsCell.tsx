import { Gasto } from "../../types/Gasto";
import EntityActionsCell from "./EntityActionsCell";
import ElimGastoModal from "../modals/gastos/ElimGastoModal";

type Props = {
  data: Gasto;
  onEdit?: (gasto: Gasto) => void;
};

const GastoActionsCell = ({ data, onEdit }: Props) => {
  return (
    <EntityActionsCell
      onEdit={onEdit ? () => onEdit(data) : undefined}
      renderDeleteModal={(isOpen, onClose) => (
        <ElimGastoModal gastoData={data} open={isOpen} onClose={onClose} />
      )}
    />
  );
};

export default GastoActionsCell;
