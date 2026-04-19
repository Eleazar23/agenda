import React, { useMemo } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Cita } from "../../types/Cita";
import { ServicioAgendado } from "../../types/ServicioAgendado";
// Register all Community features
const modules = [AllCommunityModule];
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  servicios: Array<ServicioAgendado> | [];
};

function TotalServiciosTbl({ servicios }: Props) {
  const [colDefs, setColDefs] = React.useState<Array<any>>([
    { field: "estilista", headerName: "Nombre del estilista" },
    { field: "servicio.nombre", headerName: "Nombre del servicio" },
    { field: "servicio.precio", headerName: "Precio" },
    { field: "horaInicio", headerName: "Hora de inicio" },
    { field: "horaFin", headerName: "Hora de fin" },
  ]);
  const [rowsData, setRowsData] = React.useState<Array<ServicioAgendado> | []>(servicios);

  return (
    <div style={{ height: 250 }}>
      <AgGridReact rowData={rowsData} columnDefs={colDefs} />
    </div>
  );
}

export default TotalServiciosTbl;
