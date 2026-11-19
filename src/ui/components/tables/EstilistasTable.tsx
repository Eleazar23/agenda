import * as React from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import EstilistasActionsCell from "../CustomeCells/EstilistasActionsCell";
import VacacionesCell from "../CustomeCells/VacacionesCell";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { Estilista } from "../../types/Estilista";
import { capitalizeFirstLetter } from "../../utils/utils";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// let gridApi: GridApi;

const colsData: ColDef<Estilista>[] = [
  {
    field: "name",
    headerName: "Nombre",
    valueFormatter: (params) => capitalizeFirstLetter(params.value),
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
    field: "vacaciones" as keyof Estilista,
    headerName: "Vacaciones",
    cellRenderer: VacacionesCell,
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

  const filteredData = useFilteredRowData(dataTable, searchTerm, [
    "name",
    "telefono",
  ]);

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
