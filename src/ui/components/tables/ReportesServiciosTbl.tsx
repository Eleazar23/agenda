import * as React from "react";
import { useState } from "react";

import { AllCommunityModule, ModuleRegistry, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { Box } from "@mui/material";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colDefServicios = [
  {
    field: "estilista",
    headerName: "Estilista",
  },
  {
    field: "nombreCliente",
    headerName: "Nombre Cliente",
  },
  {
    field: "servicio.nombre",
    headerName: "Servicio",
  },
  {
    field: "servicio.precio",
    headerName: "Costo",
  },
  {
    field: "metodoDePago",
    headerName: "Método de Pago",
  },
  {
    field: "fecha",
    headerName: "Fecha",
  },
  {
    field: "horaInicio",
    headerName: "Hora Inicio",
  },
  {
    field: "horaFin",
    headerName: "Hora Fin",
  },
];

let gridApi: GridApi;

type Props = {
  serviciosData: Array<any>;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  filtro?: string;
  view: "servicios" | "productos" | "total";
};

function ReportesServiciosTbl({
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
  const [colDef, setColDef] = React.useState(colDefServicios);
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

export default ReportesServiciosTbl;
