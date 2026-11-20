import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { agGridTheme } from "../../theme/agGridTheme";
import { AG_GRID_LOCALE_ES } from "../../theme/agGridLocaleEs";
import { Propina } from "../../types/Cita";
import { capitalizeFirstLetter, formatMoney } from "../../utils/utils";

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
    valueFormatter: (params) => formatMoney(params.value),
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
      <AgGridReact
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
        rowData={propinas}
        columnDefs={colDefs}
      />
    </div>
  );
}

export default TotalPropinasTbl;
