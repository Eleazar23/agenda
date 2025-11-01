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
        field: "phone",
        headerName: "Telefono"
    },{
        field: "lastVisit",
        headerName: "Fecha Ultima Visita",
    },{
        field: "bitacora",
        headerName: "Bitacora",
        cellRenderer: BitacoraBtn
    }
]

const mockData = [
    {
        name: "Eleazar Celis",
        phone: "312 210 5197",
        lastVisit: "23/08/2023",
        bitacora: ""
    }
]

const ClientsTables = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<null | Array<any>>(mockData);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

      const defaultColDef = React.useMemo(()=> ({
        flex: 1,
        headerStyle:{textAlign: 'center'}
      }),[])

    return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width:"100%" }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
        />
    </div>
)
}

export default ClientsTables;