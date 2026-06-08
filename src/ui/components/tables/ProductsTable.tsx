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

interface Props {
  searchTerm: string;
}

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

const ProductsTable = ({ searchTerm }: Props) => {
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

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return dataTable;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return dataTable.filter((row) => {
      return (
        row.nombre.toLowerCase().includes(lowerSearchTerm) ||
        row.marca.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, dataTable]);


  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={filteredData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationAutoPageSize={true}
      />
    </div>
  );
};

export default ProductsTable;
