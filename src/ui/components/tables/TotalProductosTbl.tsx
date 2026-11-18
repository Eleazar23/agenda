import React from "react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ProductoInCita } from "../../types/Producto";
import { capitalizeFirstLetter } from "../../utils/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  productos: Array<ProductoInCita>;
};

function TotalProductosTbl({ productos }: Props) {
  const [colDefs] = React.useState<ColDef<ProductoInCita>[]>([
    { field: "estilista", headerName: "Estilista", valueFormatter: (params: ValueFormatterParams<ProductoInCita>) => capitalizeFirstLetter(params.value) },
    { field: "nombre", headerName: "Nombre del producto" },
    { field: "precio", headerName: "Precio unitario" },
    { field: "cantidad", headerName: "Cantidad" },
    {
      field: "total",
      headerName: "Total",
      valueGetter: (params: ValueGetterParams<ProductoInCita>) =>
        params.data ? params.data.precio * params.data.cantidad : 0,
    },
  ]);
  return (
    <div style={{ height: 250 }}>
      <AgGridReact rowData={productos} columnDefs={colDefs} />
    </div>
  );
}

export default TotalProductosTbl;
