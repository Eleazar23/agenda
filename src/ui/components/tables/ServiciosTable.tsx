import * as React from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { agGridTheme } from "../../theme/agGridTheme";
import { AG_GRID_LOCALE_ES } from "../../theme/agGridLocaleEs";
import { useServiciosCtx } from "../../contexts/ServiciosContext";
import ServiciosActionsCell from "../CustomeCells/ServiciosActionsCell";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";
import { formatMoney } from "../../utils/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

const colsData = [
  {
    field: "nombre",
    headerName: "Nombre",
  },
  {
    field: "precio",
    headerName: "Precio",
    valueFormatter: (params: { value: number }) => formatMoney(params.value),
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
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
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
