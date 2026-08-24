import { Button } from "@mui/material";
import React from "react";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";

const EmptyCell = (params: CustomCellRendererProps) => {
  const { cita, fecha, removeServiceFromCita, addServiceToCita } =
    useAgendaContext();
  const estilista = (params.column as any)?.colId || "";
  const hr = params.data?.hour;
  const rowIndex = params.node?.rowIndex || 0;
  const cellID = `${rowIndex}-${estilista}`;
  // Derivado directamente del draft de la cita (no estado local), para que
  // se mantenga en sincronía cuando se cancela la cita o se remueve el
  // servicio desde otro lugar.
  const isSelected = cita.servicios.some((s) => s.cellID === cellID);
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
  // console.log('Empty Cell Params:', params)

  const handleClick = async () => {
    if (!isSelected) {
      addServiceToCita(cellData);
      return;
    }
    removeServiceFromCita(cellData);
  };

  return (
    <>
      <Button
        color="secondary"
        sx={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          borderRadius: 0,
          padding: "2px 4px",
        }}
        variant={isSelected ? "contained" : "text"}
        onClick={handleClick}
      >
        {" "}
        {params.value === "" ? "-" : params.value}{" "}
      </Button>
    </>
  );
};

export default React.memo(
  EmptyCell,
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);
