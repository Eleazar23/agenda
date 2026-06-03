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
  const cellData = {
    rowIndex,
    cellID,
    fecha: fecha,
    servicio: {
      id: 0,
      nombre: "",
      precio: 0,
    },
    estilista,
    horaInicio: hr.label24,
    horaFin: hr.label24,
    duracion: 30,
  };
  const { removeServiceFromCita, addServiceToCita } = useAgendaContext();
  // console.log('Empty Cell Params:', params)

  const handleClick = async () => {
    if (!isSelected) {
      setIsSelected(() => true);
      addServiceToCita(cellData);
      return;
    }
    setIsSelected(() => false);
    removeServiceFromCita(cellData);
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
