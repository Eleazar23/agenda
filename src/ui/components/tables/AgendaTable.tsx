import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useTheme } from "@mui/material/styles";
import { getHrs, celdaEstaBloqueada } from "../../utils/utils";
import CutomeCellRenderer from "../CustomeCells/CutomeCellRenderer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { useFeriadosCtx } from "../../contexts/FeriadosCtx";
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
  if (!valueA || !valueB || valueA === "" || valueB === "") return false;

  // ag-grid solo compara filas adyacentes de la misma columna (mismo
  // estilista). El span debe reflejar únicamente la duración propia de UNA
  // reserva (genarateRowsByService conserva el mismo cellID en todas las
  // filas que genera para una sola entrada); comparar por cellID evita que
  // dos citas distintas y contiguas del mismo cliente/servicio se fusionen
  // en una sola celda.
  const isSameCliente =
    valueA.clienteId === valueB.clienteId &&
    valueA.nombreCliente === valueB.nombreCliente &&
    valueA.telefonoCliente === valueB.telefonoCliente;
  const isSameServicio = valueA.servicio?.cellID === valueB.servicio?.cellID;
  const isSameEstado = valueA.estado === valueB.estado;

  return isSameCliente && isSameServicio && isSameEstado;
};

const AgendaTable = () => {
  const {
    citas,
    fecha,
    estilistas: estilistasFull,
    refetchEstilistas,
    bloqueos,
  } = useAgendaContext();
  const { feriados } = useFeriadosCtx();
  const theme = useTheme();
  const [colDefs, setColDefs] = useState<any[]>([]);
  const [rowInitData, setRowInitData] = useState<any[]>([]);

  // AgendaContext vive fuera de las rutas (no se remonta al navegar), así
  // que los estilistas que cargó al iniciar la app pueden quedar
  // desactualizados si se editaron sus vacaciones en la página de
  // Estilistas. Este componente sí se remonta cada vez que se entra a la
  // Agenda, así que aprovechamos ese montaje para refrescarlos.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar; refetchEstilistas cambia de referencia en cada render del contexto
  useEffect(() => {
    refetchEstilistas();
  }, []);

  const estilistas = useMemo(
    () =>
      estilistasFull
        .filter((est) => est.role === "estilista")
        .map((est) => est.name),
    [estilistasFull],
  );

  const feriado = useMemo(
    () => feriados.find((f) => f.fecha === fecha),
    [feriados, fecha],
  );

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
          padding: 0,
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

  const todaysCitas = useMemo(
    () => citas.filter((cita) => cita.fecha === fecha),
    [citas, fecha],
  );

  const defaultColdef = useMemo(
    () => ({
      flex: 2,
      headerStyle: { textAlign: "center" },
      sortable: false
    }),
    [],
  );

  // to use myTheme in an application, pass it to the theme grid option
  const myTheme = useMemo(
    () =>
      themeQuartz.withParams({
        columnBorder: true,
        rowBorder: false,
        oddRowBackgroundColor: theme.palette.agenda.oddRow,
      }),
    [theme],
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

  const prevRowsDataRef = useRef<Array<DynamicObject>>([]);

  const isSameCellValue = useCallback((a: any, b: any) => {
    if (a === "" || b === "") return a === b;
    if (!a || !b) return a === b;
    if (a.blocked || b.blocked) {
      return (
        a.blocked === b.blocked &&
        a.motivo === b.motivo &&
        a.bloqueoId === b.bloqueoId
      );
    }
    if (
      a.clienteId !== b.clienteId ||
      a.nombreCliente !== b.nombreCliente ||
      a.telefonoCliente !== b.telefonoCliente ||
      a.estado !== b.estado
    ) {
      return false;
    }
    const servicioA = a.servicio;
    const servicioB = b.servicio;
    return (
      servicioA?.cellID === servicioB?.cellID &&
      servicioA?.duracion === servicioB?.duracion &&
      servicioA?.horaInicio === servicioB?.horaInicio &&
      servicioA?.horaFin === servicioB?.horaFin &&
      servicioA?.servicio?.id === servicioB?.servicio?.id &&
      servicioA?.servicio?.nombre === servicioB?.servicio?.nombre &&
      servicioA?.servicio?.precio === servicioB?.servicio?.precio
    );
  }, []);

  const updateRowsDataByCitas = useCallback(() => {
    if (rowInitData.length === 0) return;

    console.log("Updating rows data by citas...", todaysCitas.length, "appointments for", fecha);

    const prevRowsData = prevRowsDataRef.current;

    // Compute the target cell values for every row (estilista columns only)
    const targetRows: Array<DynamicObject> = rowInitData.map((row) => ({ ...row }));

    todaysCitas.forEach((cita) => {
      const { clienteId, nombreCliente, telefonoCliente, fecha, estado } = cita;
      const realServices = getRealServicesArray(cita.servicios);

      realServices.forEach((servicio) => {
        const { rowIndex, estilista } = servicio;
        if (targetRows[rowIndex]) {
          targetRows[rowIndex][estilista] = {
            clienteId,
            nombreCliente,
            telefonoCliente,
            fecha,
            servicio,
            estado,
          };
        }
      });
    });

    // Celdas sin cita: si el estilista está de vacaciones o tiene un
    // bloqueo (comida/descanso) que cubre esa fila, se marcan como
    // bloqueadas en vez de vacías, para impedir agendar sobre ellas.
    estilistas.forEach((estilista) => {
      const vacacionesEstilista = estilistasFull.find(
        (e) => e.name === estilista,
      )?.vacaciones;
      targetRows.forEach((row, rowIndex) => {
        if (row[estilista] !== "") return;
        const estado = celdaEstaBloqueada(
          estilista,
          [rowIndex],
          vacacionesEstilista,
          fecha,
          bloqueos,
        );
        if (estado.blocked) {
          row[estilista] = estado;
        }
      });
    });

    // Reuse previous row/cell object references when the content hasn't changed,
    // so ag-grid (getRowId) and React.memo can skip re-rendering unaffected cells.
    const newRowsData: Array<DynamicObject> = targetRows.map((targetRow, rowIndex) => {
      const prevRow = prevRowsData[rowIndex];
      if (!prevRow) return targetRow;

      let rowChanged = false;
      const mergedRow: DynamicObject = { ...targetRow };

      Object.keys(targetRow).forEach((key) => {
        if (key === "hour" || key === "isSelected") return;
        if (isSameCellValue(targetRow[key], prevRow[key])) {
          mergedRow[key] = prevRow[key];
        } else {
          rowChanged = true;
        }
      });

      return rowChanged ? mergedRow : prevRow;
    });

    prevRowsDataRef.current = newRowsData;
    setRowsData(newRowsData);
  }, [
    todaysCitas,
    fecha,
    getRealServicesArray,
    rowInitData,
    isSameCellValue,
    estilistas,
    estilistasFull,
    bloqueos,
  ]);

  useEffect(() => {
    console.log("Citas or fecha changed, updating rows data...");
    updateRowsDataByCitas();
  }, [updateRowsDataByCitas]);

  return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: "100%", position: "relative" }}>
      {feriado ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: theme.palette.agenda.bloqueos.feriado.bg,
            pointerEvents: "auto",
          }}
        >
          {/* Pastilla blanca detrás del texto para que resalte sobre el
              fondo del bloqueo; con #263238 sobre blanco el contraste es
              >= 11:1 (AAA). */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              backgroundColor: theme.palette.agenda.bloqueos.feriado.chipBg,
              borderRadius: "999px",
              padding: "12px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: theme.palette.agenda.bloqueos.feriado.chipText,
              }}
            >
              {theme.palette.agenda.bloqueos.feriado.icon} Feriado: {feriado.nombre}
            </span>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: theme.palette.agenda.bloqueos.feriado.chipText,
              }}
            >
              No se pueden agendar citas este día
            </span>
          </div>
        </div>
      ) : null}
      <AgGridReact
        rowData={rowsData}
        getRowId={(params) => params.data.hour.label24}
        animateRows={true}
        columnDefs={colDefs}
        defaultColDef={defaultColdef}
        theme={myTheme}
        enableCellSpan={true}
        rowHeight={48}
        headerHeight={36}
      />
    </div>
  );
};

export default AgendaTable;
