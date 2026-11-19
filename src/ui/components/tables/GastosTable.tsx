import * as React from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  CellEditingStartedEvent,
  ModuleRegistry,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import GastoActionsCell from "../CustomeCells/GastoActionsCell";
import { useGastosCtx } from "../../contexts/GastosCtx";
import { Gasto } from "../../types/Gasto";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colsData: ColDef<Gasto>[] = [
  {
    field: "proveedorNombre",
    headerName: "Proveedor",
    editable: true,
  },
  {
    field: "monto",
    headerName: "Monto",
    editable: true,
    valueFormatter: (params: ValueFormatterParams<Gasto>) =>
      `$${parseFloat(params.value).toFixed(2)}`,
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
    colId: "acciones",
    headerName: "Acciones",
  },
];

type Props = {
  onEdit: (gasto: Gasto) => void;
  setTotalGastos: React.Dispatch<React.SetStateAction<number>>;
  fecha: string;
  download?: boolean;
  setDownload?: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
};

let gridApi: GridApi;

const GastosTable = ({
  onEdit,
  setTotalGastos,
  fecha,
  download,
  setDownload,
  searchTerm
}: Props) => {
  const { dataTable, fechaGastos, setFechaGastos } = useGastosCtx();
  const [colDefs] = useState<ColDef<Gasto>[]>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    [],
  );

  const gridOptions = {
    onGridReady: (params: GridReadyEvent<Gasto>) => {
      gridApi = params.api;
      // gridApi = gridRef.current!.api
      gridApi.sizeColumnsToFit();
    },
  };

  const filteredData = useFilteredRowData(dataTable, searchTerm, [
    "proveedorNombre",
    "categoria",
    "descripcion",
    "metodoPago",
  ]);

  const handleEditingStarted = (event: CellEditingStartedEvent) => {
    console.log("Cell editing started", event);
  };

  const handleCellChanged = (event: CellValueChangedEvent<Gasto>) => {
    console.log("Cell value changed", event);
  };

  const totalGastos = React.useMemo(() => {
    return filteredData.reduce((total, gasto) => total + gasto.monto, 0);
  }, [filteredData]);

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
        rowData={filteredData}
        gridOptions={gridOptions}
        columnDefs={colDefs.map((col) => {
          if (col.colId === "acciones") {
            return {
              ...col,
              cellRenderer: (props: CustomCellRendererProps<Gasto>) =>
                props.data ? (
                  <GastoActionsCell data={props.data} onEdit={onEdit} />
                ) : null,
            };
          }
          return col;
        })}
        defaultColDef={defaultColDef}
        onCellEditingStarted={handleEditingStarted}
        onCellValueChanged={handleCellChanged}
        pagination={true}
        paginationAutoPageSize={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default GastosTable;
