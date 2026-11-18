import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Propina } from "../../types/Cita";
import { capitalizeFirstLetter } from "../../utils/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  propinas: Array<Propina>;
};

const colDefs: ColDef<Propina>[] = [
  {
    field: "estilista",
    headerName: "Estilista",
    valueFormatter: (params) => capitalizeFirstLetter(params.value || ""),
  },
  {
    field: "monto",
    headerName: "Monto",
    valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`,
  },
  {
    field: "metodoDePago",
    headerName: "Método de Pago",
    valueFormatter: (params) => capitalizeFirstLetter(params.value || ""),
  },
];

function TotalPropinasTbl({ propinas }: Props) {
  return (
    <div style={{ height: 150 }}>
      <AgGridReact rowData={propinas} columnDefs={colDefs} />
    </div>
  );
}

export default TotalPropinasTbl;
