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
import EstilistasActionsCell from "../CustomeCells/EstilistasActionsCell";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { globalData } from "../../mock/globalData";


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

let gridApi: GridApi;

const colsData = [
  {
    field: "name",
    headerName: "Nombre",
  },
  {
    field: "phone",
    headerName: "Telefono",
  },
  {
    field: "actions",
    headerName: "Acciones",
    cellRenderer: EstilistasActionsCell,
  }
];

type Props = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  estilistasData: Array<any>;
  handleEdit?: (node: any) => void;
  handleAlert?: (message: string, type: "success" | "error" | "info" | "warning") => void;
};

const EstilistasTable = ({ setIsEditing, estilistasData, handleEdit, handleAlert }: Props) => {
  const {dataTable, setDataTable} = useEstilistasCtx()
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<null | Array<any>>(dataTable);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

    const getEstilistasData = () => {
    // Lógica para obtener los datos de los clientes
    console.log("Obteniendo datos de estilistas...");
    setDataTable([...globalData.estilistas]);
    return globalData.estilistas;
  };

  // const handleEditingStarted = (event: CellEditingStartedEvent) => {
  //   console.log("Cell editing started", event);
  //   setIsEditing(true);
  // };

  // const hanldeCellChanged = (event: CellValueChangedEvent<any, any, any>) => {
  //   console.log("Cell value changed", event);
  //   handleEdit && handleEdit(event.node);
  // };

  React.useEffect(() => {
    getEstilistasData();
  }, [estilistasData]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dataTable}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        gridOptions={{enableCellTextSelection: true,}}
      />
    </div>
  );
};

export default EstilistasTable;
