import React from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
// Register all Community features
const modules = [AllCommunityModule];
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type Producto = {
  id: number;
  nombre: string;
  marca: string;
  precio: string;
};

type Servicio = {
  nombre: string;
  precio: number;
  productos: Array<Producto>;
};

type Props = {
  servicios?: Array<Servicio>;
};

function TotalCitaTbl() {
  const [colDefs, setColDefs] = React.useState<Array<any>>([
    { field: "nombre", headerName: "Nombre del producto" },
    { field: "precio", headerName: "Precio" },
    { field: "cantidad", headerName: "Cantidad" },
    {
      field: "total",
      headerName: "Total",
      valueGetter: (params: any) => params.data.precio * params.data.cantidad,
    },
  ]);
  const [rowsData, setRowsData] = React.useState<Array<Producto> | undefined>([]);
  const [allProductos, setAllProductos] = React.useState<Array<Producto>>([]);
  return (
    <div style={{ height: 500 }}>
      <AgGridReact rowData={rowsData} columnDefs={colDefs} />
    </div>
  );
}

export default TotalCitaTbl;
