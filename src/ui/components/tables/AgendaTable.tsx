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
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { Servicio } from "../../types/Servicio";
ModuleRegistry.registerModules([AllCommunityModule]);

// Register all Community features
interface DynamicObject {
  [key: string]: any; // Keys are strings, values can be any type
}

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

const AgendaTable = () => {
  const [estilistas, setEstilistas] = useState<string[]>([]);
  const [colDefs, setColDefs] = useState<any[]>([]);
  const [rowInitData, setRowInitData] = useState<any[]>([]);
  
  // Load estilistas from MongoDB
  useEffect(() => {
    const loadEstilistas = async () => {
      try {
        const estilistasData = await window.api.getEstilistas();
        const filteredEstilistas = estilistasData.filter((est) => est.role === "estilista");
        const estilistasNames = filteredEstilistas.map((est) => est.name);
        setEstilistas(estilistasNames);
      } catch (error) {
        console.error("Error loading estilistas:", error);
      }
    };
    loadEstilistas();
  }, []);

  // Update column definitions and initial row data when estilistas change
  useEffect(() => {
    if (estilistas.length === 0) return;

    const estilistasDayData: DynamicObject = {};
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

    const newColDefs = [
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
    const newRowInitData = horas.map((hour) => {
      return { hour, ...estilistasDayData, isSelected: false };
    });

    setColDefs(newColDefs);
    setRowInitData(newRowInitData.slice(18, 41)); // Limit to 48 rows for a 24-hour schedule with 30-minute intervals
  }, [estilistas]);

  // Row Data: The data to be displayed.
  const [rowsData, setRowsData] = useState<[] | Array<any>>([]);
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

  const genarateRowsByService = useCallback((servicio: ServicioAgendado) => {
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
      const firstElement = rowsToAdd[0];
      const elementsToMove = rowsToAdd.slice(2);
      rowsToAdd = [firstElement, ...elementsToMove];
    }

    return rowsToAdd;
  }, []);

  const getRealServicesArray = useCallback((servicios: Array<ServicioAgendado>) => {
    let arrNewServices: Array<ServicioAgendado> = [];

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
    if (rowInitData.length === 0) return;
    
    console.log("Updating rows data by citas...", todaysCitas.length, "appointments for", fecha);
    
    if (todaysCitas.length === 0) {
      setRowsData(rowInitData);
      return;
    }

    // Build new rows in one pass instead of multiple setState calls
    const newRowsData: Array<any> = rowInitData.map(row => ({ ...row }));
    
    todaysCitas.forEach((cita) => {
      const { nombreCliente, telefonoCliente, fecha, estado } = cita;
      const realServices = getRealServicesArray(cita.servicios);
      
      realServices.forEach((servicio) => {
        const { rowIndex, estilista } = servicio;
        if (newRowsData[rowIndex]) {
          (newRowsData[rowIndex] as DynamicObject)[estilista] = {
            nombreCliente,
            telefonoCliente,
            fecha,
            servicio,
            estado,
          };
        }
      });
    });
    
    setRowsData(newRowsData);
  }, [todaysCitas, fecha, getRealServicesArray, rowInitData]);

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
