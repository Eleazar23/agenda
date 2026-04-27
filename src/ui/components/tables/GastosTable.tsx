import * as React from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  CellEditingStartedEvent,
  ModuleRegistry,
  CellValueChangedEvent,
  GridApi,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import GastoActionsCell from "../CustomeCells/GastoActionsCell";
import { useGastosCtx } from "../../contexts/GastosCtx";
import { Gasto } from "../../types/Gasto";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

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
  },
  {
    field: "acciones",
    headerName: "Acciones",
    cellRenderer: (props: any) => <GastoActionsCell {...props} />,
  },
];

type Props = {
  onEdit: (gasto: Gasto) => void;
  setTotalGastos: React.Dispatch<React.SetStateAction<number>>;
  fecha: string;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
};

let gridApi: GridApi;

const GastosTable = ({
  onEdit,
  setTotalGastos,
  fecha,
  download,
  setDownload,
}: Props) => {
  const { dataTable, getGastosByFecha, fechaGastos, setFechaGastos } =
    useGastosCtx();
  const [colDefs] = useState<any[]>(colsData);
  const gridRef = React.useRef<AgGridReact>(null);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    [],
  );

  const gridOptions = {
    onGridReady: (params: any) => {
      gridApi = params.api;
      // gridApi = gridRef.current!.api
      gridApi.sizeColumnsToFit();
    },
  };

  const handleEditingStarted = (event: CellEditingStartedEvent) => {
    console.log("Cell editing started", event);
  };

  const handleCellChanged = (event: CellValueChangedEvent<any, any, any>) => {
    console.log("Cell value changed", event);
  };

  const totalGastos = React.useMemo(() => {
    return dataTable.reduce((total, gasto) => total + gasto.monto, 0);
  }, [dataTable]);

  React.useEffect(() => {
    setTotalGastos(totalGastos);
  }, [totalGastos, setTotalGastos]);

  React.useEffect(() => {
    // getGastosByFecha(fecha)
    setFechaGastos(fecha);
    console.log("Fecha de gastos", fechaGastos);
  }, [fecha]);

  const handleDownloadComplete = () => {
    if (download && setDownload) {
      gridApi.exportDataAsCsv({ fileName: `reporte_gastos_${fecha}` });
      setDownload(false);
    }
  };

  React.useEffect(() => {
    if (download) {
      handleDownloadComplete();
    }
  }, [download, setDownload]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dataTable}
        gridOptions={gridOptions}
        columnDefs={colDefs.map((col) => {
          if (col.field === "acciones") {
            return {
              ...col,
              cellRenderer: (props: any) => (
                <GastoActionsCell {...props} onEdit={onEdit} />
              ),
            };
          }
          return col;
        })}
        defaultColDef={defaultColDef}
        onCellEditingStarted={handleEditingStarted}
        onCellValueChanged={handleCellChanged}
      />
    </div>
  );
};

export default GastosTable;
