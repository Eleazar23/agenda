import React, { useEffect, useMemo, useCallback } from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { getHrs } from "../../utils/utils";
import CutomeCellRenderer from "../CustomeCells/CutomeCellRenderer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Cita } from "../../types/Cita";
import { Servicio } from "../../types/Servicio";
import { globalData } from "../../mock/globalData";
ModuleRegistry.registerModules([AllCommunityModule]);

// Register all Community features
interface DynamicObject {
  [key: string]: any; // Keys are strings, values can be any type
}

const estilistas = globalData.estilistas.map((estilista) => estilista.name); // change to get action from mongo db
const estilistasDayData: DynamicObject = {};

const customSpanFunc = (params: any) => {
  const { valueA, valueB } = params;
  if (valueA === "" || valueB === "") {
  } else {
    const isSameCellID = valueA.servicio.cellID === valueB.servicio.cellID;
    const isSameService = valueA.servicio.servicio === valueB.servicio.servicio;
    if (isSameCellID && isSameService) {
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

const colDefs = [
  {
    headerName: "",
    field: "hour.label12",
    flex: 1,
    minWidth: 104,
    cellStyle: { fontWeight: "bold" },
  },
  ...conlDefsData,
];

const horas = getHrs();

const rowInitData = horas.map((hour) => {
  return { hour, ...estilistasDayData, isSelected: false };
});

const AgendaTable = () => {
  // Row Data: The data to be displayed.
  const [rowsData, setRowsData] = useState<[] | Array<any>>(rowInitData);
  const { citas, fecha } = useAgendaContext();

  const todaysCitas = useMemo(
    () => citas.filter((cita) => cita.fecha === fecha),
    [citas, fecha],
  );

  const defaultColdef = useMemo(
    () => ({
      flex: 2,
      headerStyle: { textAlign: "center" },
    }),
    [],
  );

  // to use myTheme in an application, pass it to the theme grid option
  const myTheme = useMemo(
    () =>
      themeQuartz.withParams({
        columnBorder: true,
        rowBorder: false,
        oddRowBackgroundColor: "#F9FAFB",
      }),
    [],
  );

  const genarateRowsByService = useCallback((servicio: Cita) => {
    const { duracion, servicio: servicioName } = servicio;
    let counter = duracion / 30 - 1;
    let rowsToAdd = [servicio];
    const lowerCaseName = servicioName.nombre.toLowerCase();

    while (counter > 0) {
      const refService = rowsToAdd[rowsToAdd.length - 1];
      const { rowIndex } = refService;
      rowsToAdd.push({ ...refService, rowIndex: rowIndex + 1 });
      counter--;
    }

    if (lowerCaseName === "tinte"  && rowsToAdd.length >=3) {
      // fix when mongo db working
      const firstElement = rowsToAdd[0]; // Get the first element
      const elementsToMove = rowsToAdd.slice(3); // Remove 2 elements starting from index 1
      // const movedElements = elementsToMove.map((el) => ({
      //   ...el,
      //   rowIndex: el.rowIndex + 2,
      // })); // Update rowIndex of moved elements
      rowsToAdd = [firstElement, ...elementsToMove]; // Reconstruct the array
    }

    return rowsToAdd;
  }, []);

  const getRealServicesArray = useCallback((servicios: Array<Cita>) => {
    let arrNewServices: Array<Cita> = [];

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
  }, [genarateRowsByService]);

  const updateRowsDataByCitas = useCallback(() => {
    console.log("Updating rows data by citas...", todaysCitas.length, "appointments for", fecha);
    
    if (todaysCitas.length === 0) {
      setRowsData(rowInitData);
      return;
    }

    // Build new rows in one pass instead of multiple setState calls
    const newRowsData: Array<any> = rowInitData.map(row => ({ ...row }));
    
    todaysCitas.forEach((cita) => {
      const { nombreCliente, telefonoCliente, fecha } = cita;
      const realServices = getRealServicesArray([cita]);
      
      realServices.forEach((servicio) => {
        const { rowIndex, estilista } = servicio;
        if (newRowsData[rowIndex]) {
          (newRowsData[rowIndex] as DynamicObject)[estilista] = {
            nombreCliente,
            telefonoCliente,
            fecha,
            servicio,
          };
        }
      });
    });
    
    setRowsData(newRowsData);
  }, [todaysCitas, fecha, getRealServicesArray]);

  useEffect(() => {
    console.log("Citas or fecha changed, updating rows data...");
    updateRowsDataByCitas();
  }, [updateRowsDataByCitas]);

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
