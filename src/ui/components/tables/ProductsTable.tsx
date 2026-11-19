import * as React from "react";
import { useState } from "react";

import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { agGridTheme } from "../../theme/agGridTheme";
import ProductosActionsCell from "../CustomeCells/ProductosActionsCell";
import { useProductosCtx } from "../../contexts/ProductosCtx";
import { useFilteredRowData } from "../../hooks/useFilteredRowData";

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
    cellDataType: "text",
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
  const [colDefs] = useState<ColDef[]>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  const filteredData = useFilteredRowData(dataTable, searchTerm, [
    "nombre",
    "marca",
  ]);


  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        theme={agGridTheme}
        rowData={filteredData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationAutoPageSize={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ProductsTable;
