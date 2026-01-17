import * as React from "react";
import { useState } from "react";

import {
  AllCommunityModule,
  CellEditingStartedEvent,
  ModuleRegistry,
  CellValueChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import ProductosActionsCell from "../CustomeCells/ProductosActionsCell";
import { useProductosCtx } from "../../contexts/ProductosCtx";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// let gridApi: GridApi;


// type Props = {
//   setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
//   productosData: Array<any>;
//   handleEdit?: (node: any) => void;
// };

const colsData = [
  {
    field: "nombre",
    headerName: "Nombre",
  },
    {
    field: "marca",
    headerName: "Marca",
    },
    {
    field: "precio",
    headerName: "Precio",
    },
    {
    field: "descripcion",
    headerName: "Descripción",
    },
    {
    field: "stock",
    headerName: "Stock",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      cellRenderer: ProductosActionsCell,
    }
];

const ProductsTable = () => {
  // Row Data: The data to be displayed.
  const { dataTable} = useProductosCtx();

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );


  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dataTable}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default ProductsTable;
