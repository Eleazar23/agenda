import React from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ProductoInCita } from "../../types/Producto";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  productos: Array<ProductoInCita>;
};

function TotalProductosTbl({ productos }: Props) {
  const [rowsData, setRowsData] = React.useState<
    Array<ProductoInCita> | undefined
  >(productos);
  const [colDefs, setColDefs] = React.useState<Array<any>>([
    { field: "estilista", headerName: "Estilista" },
    { field: "nombre", headerName: "Nombre del producto" },
    { field: "precio", headerName: "Precio unitario" },
    { field: "cantidad", headerName: "Cantidad" },
    {
      field: "total",
      headerName: "Total",
      valueGetter: (params: any) => params.data.precio * params.data.cantidad,
    },
  ]);
  return (
    <div style={{ height: 250 }}>
      <AgGridReact rowData={productos} columnDefs={colDefs} />
    </div>
  );
}

export default TotalProductosTbl;
