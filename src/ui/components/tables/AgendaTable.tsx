import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  SpanRowsParams,
  GridOptions,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { hrs12f, getHrs } from "../../utils/utils";
import CutomeCellRenderer from "../CustomeCells/CutomeCellRenderer";
import { Cita, Servicio, useAgendaContext } from "../../contexts/AgendaContext";
ModuleRegistry.registerModules([AllCommunityModule]);

// Register all Community features
interface DynamicObject {
  [key: string]: any; // Keys are strings, values can be any type
}

const estilistas = ["tomi", "felix", "magi", "arturo", "mimi"];
const estilistasDayData: DynamicObject = {};


const customSpanFunc = (params: any) => {
  const { valueA, valueB } = params;
  if (valueA === "" || valueB === "") {
  } else {
    if (valueA.servicio.cellID === valueB.servicio.cellID) {
      return true;
    }
  }
  return false;
};

const conlDefsData = estilistas.map((estilista) => {
  estilistasDayData[estilista] = "";
  return {
    field: estilista,
    headerName: estilista.toUpperCase(),
    spanRows: customSpanFunc,
    cellRenderer: CutomeCellRenderer,
    cellStyle: {
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      padding: ".1rem",
    },
  };
});

const colsData = [
  {
    headerName: "",
    field: "hour.label12",
    flex: 1,
    minWidth: 104,
    cellStyle: { fontWeight: "bold" },
  },
  ...conlDefsData,
];

const horas = getHrs()
console.log({horas})

// const rowInitData = hrs12f.map((hour) => {
//   return { hr: hour, ...estilistasDayData, isSelected: false };
// });

const rowInitData = horas.map((hour) => {
  return { hour, ...estilistasDayData, isSelected: false };
});




const AgendaTable = () => {
  // Row Data: The data to be displayed.
  const [rowsData, setRowsData] = useState<[] | Array<any>>(rowInitData);
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<[] | Array<any>>(colsData);
  const { agendaData } = useAgendaContext();
  const { citas } = agendaData;

  const defaultColdef = React.useMemo(
    () => ({
      cellRendererParams: { rowsData, setRowsData },
      flex: 2,
      headerStyle: { textAlign: "center" },
    }),
    []
  );

  // to use myTheme in an application, pass it to the theme grid option
  const myTheme = themeQuartz.withParams({
    columnBorder: true,
    rowBorder: false,
    oddRowBackgroundColor: "#F9FAFB",
  });

  const genarateRowsByService = (servicio: Servicio) => {
    const { duracion } = servicio;
    let counter = duracion / 30 - 1;
    let rowsToAdd = [servicio];

    while (counter > 0) {
      const refService = rowsToAdd[rowsToAdd.length - 1];
      const { rowIndex } = refService;
      rowsToAdd.push({ ...refService, rowIndex: rowIndex + 1 });
      counter--;
    }

    return rowsToAdd;
  };
  const getRealServicesArray = (servicios: Array<Servicio>) => {
    let arrNewServices: Array<Servicio> = [];

    servicios.forEach((servicio) => {
      if (servicio.duracion <= 30) {
        arrNewServices.push(servicio);
      }

      if (servicio.duracion > 30) {
        const subservices = genarateRowsByService(servicio);
        arrNewServices = arrNewServices.concat(subservices);
      }
    });
    return arrNewServices;
  };

  const updateRows = (cita: Cita) => {
    const { nombreCliente, telefonoCliente, fecha, servicios } = cita;
    let newRowsData = [...rowsData];
    const realServices = getRealServicesArray(servicios);
    realServices.forEach((servicio) => {
      const { rowIndex } = servicio;
      const { estilista } = servicio;
      let rowToModify = newRowsData[rowIndex];
      rowToModify[estilista] = { nombreCliente, telefonoCliente, fecha, servicio };
    });
    setRowsData(newRowsData);
  };

  const updateRowsDataByCitas = () => {
    citas.forEach((cita) => {
      updateRows(cita);
    });
  };

  useEffect(() => {
    updateRowsDataByCitas();
  }, [citas]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%" }}>
      <AgGridReact
        rowData={rowsData}
        columnDefs={colDefs}
        defaultColDef={defaultColdef}
        theme={myTheme}
        rowHeight={104}
        enableCellSpan={true}
      />
    </div>
  );
};

export default AgendaTable;
