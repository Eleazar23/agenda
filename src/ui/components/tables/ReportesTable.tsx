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
import { capitalizeFirstLetter, fechaSortKey, formatMoney } from "../../utils/utils";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Las fechas vienen como DD-MM-YYYY; se ordenan como YYYY-MM-DD para que el
// orden de la columna sea cronológico en reportes de semana/mes.
const fechaCol = {
  field: "fecha",
  headerName: "Fecha",
  comparator: (a: string, b: string) =>
    fechaSortKey(a || "").localeCompare(fechaSortKey(b || "")),
};

const colDefServicios = [
  {
    field: "estilista",
    headerName: "Estilista",
    valueFormatter: (params: ValueFormatterParams) => capitalizeFirstLetter(params.value),
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
    valueFormatter: (params: ValueFormatterParams) => formatMoney(params.value),
  },
  {
    field: "metodoDePago",
    headerName: "Método de Pago",
  },
  fechaCol,
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
      { field: "estilista", headerName: "Estilista", valueFormatter: (params: ValueFormatterParams) => capitalizeFirstLetter(params.value) },
    { field: "nombreCliente", headerName: "Cliente" },
    { field: "nombre", headerName: "Nombre del producto" },
    {
      field: "precio",
      headerName: "Precio unitario",
      valueFormatter: (params: ValueFormatterParams) => formatMoney(params.value),
    },
    { field: "cantidad", headerName: "Cantidad" },
    {
      field: "total",
      headerName: "Total",
      valueGetter: (params: ValueGetterParams) => params.data.precio * params.data.cantidad,
      valueFormatter: (params: ValueFormatterParams) => formatMoney(params.value),
    },
    fechaCol,

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
    valueFormatter: (params: ValueFormatterParams) => formatMoney(params.value),
  },
  { ...fechaCol, editable: false },
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

const colDefPropinas = [
  {
    field: "estilista",
    headerName: "Estilista",
    valueFormatter: (params: ValueFormatterParams) => capitalizeFirstLetter(params.value),
  },
  { field: "nombreCliente", headerName: "Cliente" },
  {
    field: "monto",
    headerName: "Monto",
    valueFormatter: (params: ValueFormatterParams) => formatMoney(params.value),
  },
  {
    field: "metodoDePago",
    headerName: "Método de Pago",
    valueFormatter: (params: ValueFormatterParams) => capitalizeFirstLetter(params.value || ""),
  },
  fechaCol,
];

type Props = {
  reportesData: Array<object>;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: string;
  filtro?: string;
  view: "servicios" | "productos" | "total" | "gastos" | "propinas";
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

  React.useEffect(() => {
    if (view === "servicios") {
      setColDef(colDefServicios);
    } else if (view === "productos") {
      setColDef(colDefProductos);
    } else if (view === "gastos") {
      setColDef(colsData);
    } else if (view === "propinas") {
      setColDef(colDefPropinas);
    }
  }, [view]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
        ref={gridRef}
        rowData={reportesData}
        columnDefs={colDef}
        gridOptions={gridOptions}
        defaultColDef={defaultColdef}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ReportesTable;
