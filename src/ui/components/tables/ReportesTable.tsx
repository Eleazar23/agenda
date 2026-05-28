import * as React from "react";
import { useState } from "react";

import { AllCommunityModule, ModuleRegistry, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component

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

]

const colsData = [
  {
    field: "proveedorNombre",
    headerName: "Proveedor",
    editable: true,
  },
  {
    field: "monto",
    headerName: "Monto",
    editable: true,
    valueFormatter: (params: any) => `$${parseFloat(params.value).toFixed(2)}`,
  },
  {
    field: "fecha",
    headerName: "Fecha",
    editable: false,
  },
  {
    field: "categoria",
    headerName: "Categoría",
    editable: true,
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    editable: true,
  },
  {
    field: "metodoPago",
    headerName: "Método de Pago",
    editable: true,
  }
];

type Props = {
  reportesData: Array<any>;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  filtro?: string;
  view: "servicios" | "productos" | "total" | "gastos";
};

let gridApi: GridApi;

const ReportesTable = ({
  reportesData,
  download,
  setDownload,
  currentDate,
  filtro,
  view,
}: Props) => {
  const gridRef = React.useRef<AgGridReact>(null);
  const [colDef, setColDef] = React.useState(colDefServicios);


  const handleDownloadComplete = () => {
    if (download && setDownload) {
      gridApi.exportDataAsCsv({ fileName: `reporte_${view}_${filtro}_${currentDate}` });
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

  React.useEffect(() => {
    if (view === "servicios") {
      setColDef(colDefServicios);
    } else if (view === "productos") {
      setColDef(colDefProductos);
    } else if (view === "gastos") {
      setColDef(colsData);
    }
  }, [view]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={reportesData}
        columnDefs={colDef}
        gridOptions={gridOptions}
        defaultColDef={defaultColdef}
      />
    </div>
  );
};

export default ReportesTable;
