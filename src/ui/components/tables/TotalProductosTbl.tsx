import React from "react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { agGridTheme } from "../../theme/agGridTheme";
import { AG_GRID_LOCALE_ES } from "../../theme/agGridLocaleEs";
import { ProductoInCita } from "../../types/Producto";
import { capitalizeFirstLetter, formatMoney } from "../../utils/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  productos: Array<ProductoInCita>;
};

function TotalProductosTbl({ productos }: Props) {
  const [colDefs] = React.useState<ColDef<ProductoInCita>[]>([
    { field: "estilista", headerName: "Estilista", valueFormatter: (params: ValueFormatterParams<ProductoInCita>) => capitalizeFirstLetter(params.value) },
    { field: "nombre", headerName: "Nombre del producto" },
    {
      field: "precio",
      headerName: "Precio unitario",
      valueFormatter: (params: ValueFormatterParams<ProductoInCita>) => formatMoney(params.value),
    },
    { field: "cantidad", headerName: "Cantidad" },
    {
      field: "total",
      headerName: "Total",
      valueGetter: (params: ValueGetterParams<ProductoInCita>) =>
        params.data ? params.data.precio * params.data.cantidad : 0,
      valueFormatter: (params: ValueFormatterParams<ProductoInCita>) => formatMoney(params.value),
    },
  ]);
  return (
    <div style={{ height: 250 }}>
      <AgGridReact
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
        rowData={productos}
        columnDefs={colDefs}
      />
    </div>
  );
}

export default TotalProductosTbl;
