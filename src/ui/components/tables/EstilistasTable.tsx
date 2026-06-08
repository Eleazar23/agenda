import * as React from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import EstilistasActionsCell from "../CustomeCells/EstilistasActionsCell";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { Estilista } from "../../types/Estilista";


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// let gridApi: GridApi;

const colsData: ColDef<any>[] = [
  {
    field: "name",
    headerName: "Nombre",
  },
  {
    field: "telefono",
    headerName: "Telefono",
  },
  {
    field: "role",
    headerName: "Rol",
  },
  {
    field: "actions" as keyof Estilista,
    headerName: "Acciones",
    cellRenderer: EstilistasActionsCell,
  }
];

type Props = {
  searchTerm: string;
};

const EstilistasTable = ({ searchTerm }: Props) => {
  // Row Data: The data to be displayed.
  const {dataTable } = useEstilistasCtx();

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return dataTable;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return dataTable.filter((estilista) =>
      estilista.name.toLowerCase().includes(lowerSearchTerm) ||
      estilista.telefono.toLowerCase().includes(lowerSearchTerm)
    );
  }, [dataTable, searchTerm]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={filteredData}
        columnDefs={colsData}
        defaultColDef={defaultColDef}
        gridOptions={{enableCellTextSelection: true,}}
        paginationAutoPageSize={true}
        pagination={true}
      />
    </div>
  );
};

export default EstilistasTable;
