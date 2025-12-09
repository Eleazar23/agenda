import * as React from "react";
import { useState } from "react";

import {
  AllCommunityModule,
  CellClickedEvent,
  CellEditingStartedEvent,
  ModuleRegistry,
  GridApi,
  createGrid,
  CellValueChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import BitacoraBtn from "../buttons/BitacoraBtn";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

let gridApi: GridApi;

const colsData = [
  {
    field: "name",
    headerName: "Nombre",
    editable: true,
  },
  {
    field: "phone",
    headerName: "Telefono",
    editable: true,
  },
  {
    field: "correo",
    headerName: "Correo",
    editable: true,
  },
  {
    field: "lastVisit",
    headerName: "Fecha Ultima Visita",
  },
  {
    field: "bitacora",
    headerName: "Bitacora",
    cellRenderer: BitacoraBtn,
  },
];

type Props = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  clientesData: Array<any>;
  handleEdit?: (node: any) => void;
};

const ClientsTables = ({ setIsEditing, clientesData, handleEdit }: Props) => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<null | Array<any>>(clientesData);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  const handleEditingStarted = (event: CellEditingStartedEvent) => {
    console.log("Cell editing started", event);
    setIsEditing(true);
  };

  const hanldeCellChanged = (event: CellValueChangedEvent<any, any, any>) => {
    console.log("Cell value changed", event);
    handleEdit && handleEdit(event.node);
  };

  React.useEffect(() => {
    setRowData(clientesData);
  }, [clientesData]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onCellEditingStarted={handleEditingStarted}
        onCellValueChanged={hanldeCellChanged}
      />
    </div>
  );
};

export default ClientsTables;
