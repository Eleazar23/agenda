import * as React from "react";
import { useState } from "react";

import {
  AllCommunityModule,
  CellEditingStartedEvent,
  ModuleRegistry,
  CellValueChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import ClientesActionsCell from "../CustomeCells/ClientesActionsCell";
import { useClientesCtx } from "../../contexts/ClientesCtx";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
const colsData = [
  {
    field: "nombre",
    headerName: "Nombre",
    editable: true,
  },
  {
    field: "telefono",
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
    field: "acciones",
    headerName: "Acciones",
    cellRenderer: ClientesActionsCell,
  },
];

type Props = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit?: (node: any) => void;
  searchTerm?: string;
};

const ClientsTables = ({ setIsEditing, handleEdit, searchTerm }: Props) => {
  const gridRef = React.useRef<AgGridReact<any>>(null);
  // Row Data: The data to be displayed.
  const {dataTable } = useClientesCtx();
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
    return dataTable.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dataTable, searchTerm]);

  const handleEditingStarted = (event: CellEditingStartedEvent) => {
    console.log("Cell editing started", event);
    setIsEditing(true);
  };

  const hanldeCellChanged = (event: CellValueChangedEvent<any, any, any>) => {
    console.log("Cell value changed", event);
    handleEdit && handleEdit(event.node);
  };

  // React.useEffect(() => {
  //   setRowData(globalData.clientes);
  // }, []);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={filteredData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onCellEditingStarted={handleEditingStarted}
        onCellValueChanged={hanldeCellChanged}
        paginationAutoPageSize={true}
        pagination={true}
      />
    </div>
  );
};

export default ClientsTables;
