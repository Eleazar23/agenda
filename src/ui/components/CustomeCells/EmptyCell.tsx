import { Button } from "@mui/material";
import { useState } from "react";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";

const EmptyCell = (params: CustomCellRendererProps) => {
  const { cita, fecha } = useAgendaContext();
  const estilista = (params.column as any)?.colId || "";
  const hr = params.data?.hour;
  const rowIndex = params.node?.rowIndex || 0;
  const [isSelected, setIsSelected] = useState(false);
  const cellID = `${rowIndex}-${estilista}`;
  const cellData = { cellID, estilista, horaInicio: hr?.label24 || "", fecha, rowIndex };
  const { removeServiceFromCita, addServiceToCita } = useAgendaContext();
  // console.log('Empty Cell Params:', params)

  const handleClick = async () => {
    if (!isSelected) {
      setIsSelected( () => true);
      addServiceToCita({...cita, ...cellData});
      return;
    }
    setIsSelected( () => false);
    removeServiceFromCita({...cita, ...cellData});
  };

  return (
    <>
      <Button
      color="secondary"
        sx={{ width: "100%" }}
        variant={isSelected ? "contained" : "text"}
        onClick={handleClick}
      >
        {" "}
        {params.value === "" ? "-" : params.value}{" "}
      </Button>
    </>
  );
};

export default EmptyCell;
