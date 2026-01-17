import * as React from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useServiciosCtx } from "../../contexts/ServiciosContext";
import ServiciosActionsCell from "../CustomeCells/ServiciosActionsCell";

ModuleRegistry.registerModules([AllCommunityModule]);

const colsData = [
  {
    field: "nombre",
    headerName: "Nombre",
  },
  {
    field: "precio",
    headerName: "Precio",
  },
  {
    field: "acciones",
    headerName: "Acciones",
    cellRenderer: ServiciosActionsCell,
  },
];

const ServiciosTable = () => {
  const { dataTable } = useServiciosCtx();
  const [colDefs] = useState<Array<any>>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dataTable}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default ServiciosTable;
