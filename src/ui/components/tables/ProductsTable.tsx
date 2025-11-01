import * as React from 'react';
import { useState } from 'react';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import BitacoraBtn from '../buttons/BitacoraBtn';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const colsData = [
    {
        field: "name",
        headerName: "Nombre"
    },{
        field: "type",
        headerName: "Tipo"
    },{
        field: "price",
        headerName: "Precio",
    },{
        field: "actions",
        headerName: "Acciones",
        cellRenderer: BitacoraBtn
    }
]

const mockData = [
    {
        name: "Spray Fijador",
        type: "Fijador",
        price: "550",
        actions: ""
    }
]

const ProductsTable = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<null | Array<any>>(mockData);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

    return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%" }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
        />
    </div>
)
}

export default ProductsTable;