import * as React from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { agGridTheme } from "../../theme/agGridTheme";
import { AG_GRID_LOCALE_ES } from "../../theme/agGridLocaleEs";
import { Box } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colDefProductos = [
  { field: "estilista", headerName: "Estilista", valueFormatter: (params: ValueFormatterParams) => capitalizeFirstLetter(params.value) },
  { field: "nombre", headerName: "Nombre del producto" },
  { field: "precio", headerName: "Precio unitario" },
  { field: "cantidad", headerName: "Cantidad" },
  {
    field: "total",
    headerName: "Total",
    valueGetter: (params: ValueGetterParams) => params.data.precio * params.data.cantidad,
  },
];

let gridApi: GridApi;

type Props = {
  serviciosData: Array<object>;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  filtro?: string;
};

function ReportesProductosTbl({
  serviciosData,
  download,
  setDownload,
  currentDate,
  filtro,
}: Props) {
  const gridRef = React.useRef<AgGridReact>(null);

  const handleDownloadComplete = () => {
    if (download && setDownload) {
      gridApi.exportDataAsCsv({
        fileName: `reporte_servicios_${filtro}_${currentDate}`,
      });
      setDownload(false);
    }
  };

  const defaultColdef = {
    sortable: true,
    filter: true,
  };
  const gridOptions = {
    onGridReady: (params: GridReadyEvent) => {
      gridApi = params.api;
      // gridApi = gridRef.current!.api
      gridApi.sizeColumnsToFit();
    },
  };

  React.useEffect(() => {
    if (download) {
      handleDownloadComplete();
    }
  }, [download, setDownload]);
  const [colDef] = React.useState(colDefProductos);
  return (
    <Box component="div" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
        ref={gridRef}
        rowData={serviciosData}
        columnDefs={colDef}
        gridOptions={gridOptions}
        defaultColDef={defaultColdef}
      />
    </Box>
  );
}

export default ReportesProductosTbl;
