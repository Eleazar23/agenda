import * as React from "react";
import { useState } from "react";

import { AllCommunityModule, ModuleRegistry, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { Box } from "@mui/material";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colDefProductos = [
  { field: "estilista", headerName: "Estilista" },
  { field: "nombre", headerName: "Nombre del producto" },
  { field: "precio", headerName: "Precio unitario" },
  { field: "cantidad", headerName: "Cantidad" },
  {
    field: "total",
    headerName: "Total",
    valueGetter: (params: any) => params.data.precio * params.data.cantidad,
  },
];

let gridApi: GridApi;

type Props = {
  serviciosData: Array<any>;
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
    onGridReady: (params: any) => {
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
  const [colDef, setColDef] = React.useState(colDefProductos);
  return (
    <Box component="div" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
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
