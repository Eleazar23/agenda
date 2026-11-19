import * as React from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useServiciosCtx } from "../../contexts/ServiciosContext";
import ServiciosActionsCell from "../CustomeCells/ServiciosActionsCell";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";

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

const ServiciosTable = ({ searchTerm }: { searchTerm: string }) => {
  const { dataTable } = useServiciosCtx();
  const [colDefs] = useState<ColDef[]>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  const filteredData = useFilteredRowData(dataTable, searchTerm, ["nombre"]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={filteredData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationAutoPageSize={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ServiciosTable;
