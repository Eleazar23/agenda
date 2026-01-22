import * as React from "react";
import { useState } from "react";

import { AllCommunityModule, ModuleRegistry, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colsData = [
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
  {
    field: "duracion",
    headerName: "Duración",
  },
];

type Props = {
  reportesData: Array<any>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  filtro?: string;
};

let gridApi: GridApi;
const ReportesTable = ({ reportesData, setTotal, download, setDownload, currentDate, filtro }: Props) => {
  const gridRef = React.useRef<AgGridReact>(null);
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<null | Array<any>>(reportesData);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

  React.useEffect(() => {
    const totalCosto = reportesData.reduce(
      (acc, reporte) => acc + Number(reporte.servicio.precio),
      0
    );
    setTotal(Number(totalCosto));
  }, [reportesData, setTotal]);

  const handleDownloadComplete = () => {
    if (download && setDownload) {
    gridApi.exportDataAsCsv({fileName: `reporte_${filtro}_${currentDate}`});
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

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={reportesData}
        columnDefs={colDefs}
        gridOptions={gridOptions}
        defaultColDef={defaultColdef}
      />
    </div>
  );
};

export default ReportesTable;
