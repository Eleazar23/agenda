import * as React from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import EstilistasActionsCell from "../CustomeCells/EstilistasActionsCell";
import { useEstilistasCtx } from "../../contexts/EstilistaContext";
import { Estilista } from "../../types/Estilista";


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// let gridApi: GridApi;

const colsData: ColDef<any>[] = [
  {
    field: "name",
    headerName: "Nombre",
  },
  {
    field: "telefono",
    headerName: "Telefono",
  },
  {
    field: "role",
    headerName: "Rol",
  },
  {
    field: "actions" as keyof Estilista,
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
  // Row Data: The data to be displayed.
  const {dataTable } = useEstilistasCtx();

  // Column Definitions: Defines the columns to be displayed.
  // const [colDefs, setColDefs] = useState<null | Array<any>>(colsData);

  const defaultColDef = React.useMemo(
    () => ({
      flex: 1,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  //   const getEstilistasData = () => {
  //   // Lógica para obtener los datos de los clientes
  //   console.log("Obteniendo datos de estilistas...");
  //   setDataTable([...globalData.estilistas]);
  //   return globalData.estilistas;
  // };

  // React.useEffect(() => {
  //   getEstilistasData();
  // }, [estilistasData]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dataTable}
        columnDefs={colsData}
        defaultColDef={defaultColDef}
        gridOptions={{enableCellTextSelection: true,}}
      />
    </div>
  );
};

export default EstilistasTable;
