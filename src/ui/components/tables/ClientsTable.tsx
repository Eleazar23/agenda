import * as React from "react";
import { useState } from "react";

import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import ClientesActionsCell from "../CustomeCells/ClientesActionsCell";
import { useClientesCtx } from "../../contexts/ClientesCtx";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
const colsData = [
  {
    field: "nombre",
    headerName: "Nombre",
  },
  {
    field: "telefono",
    headerName: "Telefono",
  },
  {
    field: "correo",
    headerName: "Correo",
  },
  {
    field: "lastVisit",
    headerName: "Fecha Ultima Visita",
  },
  {
    field: "acciones",
    headerName: "Acciones",
    cellRenderer: ClientesActionsCell,
  },
];

type Props = {
  searchTerm?: string;
};

const ClientsTables = ({ searchTerm }: Props) => {
  // Row Data: The data to be displayed.
  const {dataTable } = useClientesCtx();
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs] = useState<ColDef[]>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  const filteredData = useFilteredRowData(dataTable, searchTerm, [
    "nombre",
    "telefono",
    "correo",
  ]);

  // React.useEffect(() => {
  //   setRowData(globalData.clientes);
  // }, []);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={filteredData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        paginationAutoPageSize={true}
        pagination={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ClientsTables;
