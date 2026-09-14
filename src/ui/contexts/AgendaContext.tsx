import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import {
  getCurrentDate,
  getCurrentTime,
  getOccupiedRows,
  seSobreponeConOtroServicio,
  citaTieneServiciosSobrepuestos,
} from "../utils/utils";
import { Cita } from "../types/Cita";
import { Servicio } from "../types/Servicio";
import { useSnackbar } from "notistack";
import { Cliente } from "../types/Cliente";
import { ServicioAgendado } from "../types/ServicioAgendado";
import { ProductoInCita } from "../types/Producto";

type Props = {
  children: React.ReactNode;
};

type Alert = "success" | "error" | "info" | "warning";

type AgendaContex = {
  fecha: string;
  setFecha: React.Dispatch<React.SetStateAction<string>>;
  minDuration: number;
  setMinDuration: React.Dispatch<React.SetStateAction<number>>;
  isCitaOpen: boolean;
  setIsCitaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBooking: boolean;
  setIsBooking: React.Dispatch<React.SetStateAction<boolean>>;
  citas: [] | Array<Cita>;
  setCitas: React.Dispatch<React.SetStateAction<[] | Array<Cita>>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  cita: Cita;
  setCita: React.Dispatch<React.SetStateAction<Cita>>;
  handleEditCita: (idCita: string, newCitaData: Cita, productosToUpdate: ProductoInCita[]) => Promise<boolean>;
  addServiceToCita: (servicio: ServicioAgendado) => void;
  removeServiceFromCita: (servicio: ServicioAgendado) => void;
  updateDuracion: (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => boolean;
  handleCancelarCita: () => void;
  updateService: (cellID: string, updatedService: Servicio) => void;
  guardarCita: () => Promise<void>;
  handleAlert: (message: string, alertType: Alert) => void;
  searchClienteByNombre: (nombre: string) => Promise<Cliente | null>;
  searchClientesByNombre: (nombre: string) => Promise<Cliente[] | null>;
  searchClienteByPhone: (telefono: string) => Promise<Cliente | null>;
  addCliente: (cliente: Cliente) => Promise<Cliente | null>;
};

export const AgendaContext = createContext<AgendaContex | null>(null);

const initialDate = getCurrentDate().formattedDate;

const initialContextData = {
  fecha: initialDate,
  minDuration: 30,
  isCitaOpen: false,
  isBooking: false,
  citas: [],
  cita: {
    id: "",
    clienteId: 0,
    fecha: initialDate,
    nombreCliente: "",
    telefonoCliente: "",
    servicios: [],
    productos: [],
    estado: "sin confirmar",
    metodoDePago: "efectivo",
    notas: "",
  },
  currentPage: "agenda",
};

export const AgendaContextProvider = ({ children }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [fecha, setFecha] = useState(initialContextData.fecha);
  const [minDuration, setMinDuration] = useState(
    initialContextData.minDuration,
  );
  const [isCitaOpen, setIsCitaOpen] = useState(initialContextData.isCitaOpen);
  const [isBooking, setIsBooking] = useState(initialContextData.isBooking);
  const [citas, setCitas] = useState<Array<Cita>>(initialContextData.citas);
  const [cita, setCita] = useState<Cita>(initialContextData.cita);
  const [currentPage, setCurrentPage] = useState(
    initialContextData.currentPage,
  );
  const isGuardandoCitaRef = useRef(false);
  const isEditandoCitaRef = useRef(false);

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getCitasFromDB = async (fecha: string) => {
    try {
      const citasFromDB = await window.api.getCitasByFecha(fecha);
      setCitas(citasFromDB);
    } catch (error) {
      console.error("Error loading citas:", error);
      handleAlert("Error al cargar las citas", "error");
    }
  };

  const updateProductosStock = async (productos: ProductoInCita[]) => {
    for (const producto of productos) {
      await window.api.decrementProductoStock(producto.id, producto.cantidad);
    }
  };

  const handleEditCita = async (
    idCita: string,
    newCitaData: Cita,
    productosToUpdate: ProductoInCita[],
  ): Promise<boolean> => {
    if (isEditandoCitaRef.current) return false;
    isEditandoCitaRef.current = true;
    try {
      if (newCitaData.estado === "cancelado") {
        await window.api.deleteCita(idCita);
        getCitasFromDB(fecha);
        handleAlert("Cita cancelada", "info");
        return true;
      }

      if (newCitaData.servicios.length === 0) {
        await window.api.deleteCita(idCita);
        getCitasFromDB(fecha);
        handleAlert("Cita eliminada por no tener servicios", "info");
        return true;
      }

      // El id de una cita es una clave compuesta fecha-clienteId. Si el
      // usuario cambió la fecha desde el modal, el id "correcto" para esos
      // datos ya no es el mismo con el que se guardó originalmente.
      const nuevoId = `${newCitaData.fecha}-${newCitaData.clienteId}`;
      const cambioDeFecha = nuevoId !== idCita;

      // Se consulta la BD por la fecha destino (no el estado de contexto,
      // que solo tiene cargada la fecha que la agenda está mostrando) para
      // detectar solapes incluso cuando la cita se mueve a otro día.
      const otrasCitasEnFecha = await window.api.getCitasByFecha(
        newCitaData.fecha,
      );
      const otrasCitas = otrasCitasEnFecha.filter((c) => c.id !== idCita);

      // Si la cita se mueve a una fecha donde el mismo cliente ya tiene
      // otra cita, no hay que bloquear el movimiento (el cliente puede
      // perfectamente tener dos citas el mismo día con distinto
      // estilista/horario) sino fusionar los servicios en esa cita
      // existente, igual que ya hace guardarCitaExistente al agregar un
      // servicio nuevo a una cita del mismo día.
      const citaDestinoExistente = cambioDeFecha
        ? otrasCitas.find((c) => c.clienteId === newCitaData.clienteId)
        : undefined;

      const otrasCitasParaSolape = citaDestinoExistente
        ? otrasCitas.filter((c) => c.id !== citaDestinoExistente.id)
        : otrasCitas;
      const serviciosDeOtrasCitas = otrasCitasParaSolape.flatMap(
        (c) => c.servicios,
      );
      const serviciosFinales = citaDestinoExistente
        ? [...citaDestinoExistente.servicios, ...newCitaData.servicios]
        : newCitaData.servicios;

      if (
        citaTieneServiciosSobrepuestos([
          ...serviciosDeOtrasCitas,
          ...serviciosFinales,
        ])
      ) {
        handleAlert(
          "Hay servicios que se sobreponen con otra cita ya agendada en esa fecha y horario",
          "error",
        );
        return false;
      }

      await updateProductosStock(productosToUpdate);
      if (citaDestinoExistente) {
        // El cliente ya tenía otra cita ese día: se fusiona en vez de
        // duplicar.
        await window.api.deleteCita(idCita);
        await window.api.updateCita({
          ...citaDestinoExistente,
          servicios: serviciosFinales,
          estado: newCitaData.estado,
        });
      } else if (cambioDeFecha) {
        // El índice unique de "id" no permite mutarlo in place con
        // updateCita, así que se recrea el documento con el id correcto.
        const citaConNuevoId = { ...newCitaData, id: nuevoId };
        await window.api.deleteCita(idCita);
        await window.api.addCita(citaConNuevoId);
      } else {
        await window.api.updateCita(newCitaData);
      }
      getCitasFromDB(fecha);
      handleAlert("Cita actualizada", "success");
      return true;
    } catch (error) {
      console.error("Error updating cita:", error);
      handleAlert("Error al actualizar la cita", "error");
      return false;
    } finally {
      isEditandoCitaRef.current = false;
    }
  };

  const addServiceToCita = (servicio: ServicioAgendado) => {
    setIsBooking(true);
    setCita((prev) => {
      // Protección contra doble clic/doble evento: no duplicar la misma
      // celda si ya está en el draft.
      if (prev.servicios.some((s) => s.cellID === servicio.cellID)) {
        console.log("Servicio ya agregado a cita:", servicio);
        return prev;
      }
      console.log("Servicio agregado a cita:", servicio);
      return {
        ...prev,
        fecha,
        servicios: [...prev.servicios, servicio],
      };
    });
  };

  const removeServiceFromCita = (servicio: ServicioAgendado) => {
    setCita((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((s) => s.cellID !== servicio.cellID),
    }));
    console.log("Servicio removido de cita:", servicio);
  };

  const updateServicioAgendado = (
    cellID: string,
    changes: Partial<ServicioAgendado>,
  ) => {
    setCita((prev) => {
      const index = prev.servicios.findIndex((s) => s.cellID === cellID);
      if (index === -1) return prev;

      const updatedServicios = [...prev.servicios];
      updatedServicios[index] = { ...updatedServicios[index], ...changes };
      return { ...prev, fecha, servicios: updatedServicios };
    });
  };

  const updateService = (cellID: string, updatedService: Servicio) => {
    // Nota: aquí no se fusionan bloques contiguos con el mismo servicio.
    // Mientras se arma la cita, cada celda de la agenda debe mantener un
    // cellID estable para poder cancelarse individualmente (ver
    // removeServiceFromCita / EmptyCell). La fusión visual ya la hace
    // customSpanFunc en AgendaTable, y al editar una cita ya guardada
    // mergeContiguousServicios la normaliza en un solo registro.
    updateServicioAgendado(cellID, { servicio: updatedService });
  };

  const updateDuracion = (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ): boolean => {
    const [rowIndexStr, ...estilistaParts] = cellID.split("-");
    const rowIndex = Number(rowIndexStr);
    const estilista = estilistaParts.join("-");
    const newRowIndexes = getOccupiedRows({ rowIndex, duracion: newDuracion });

    const citasDelDia = citas.filter((c) => c.fecha === fecha);
    const otrosServiciosEnCita = cita.servicios.filter(
      (s) => s.cellID !== cellID,
    );

    if (
      seSobreponeConOtroServicio(
        estilista,
        newRowIndexes,
        citasDelDia,
        otrosServiciosEnCita,
      )
    ) {
      handleAlert(
        "La hora de fin se sobrepone con otro servicio ya agendado",
        "error",
      );
      return false;
    }

    updateServicioAgendado(cellID, { duracion: newDuracion, horaFin });
    return true;
  };

  const handleCancelarCita = () => {
    setCita(initialContextData.cita);
    setIsBooking(() => false);
  };

  const guardarCitaExistente = async (citaExistente: Cita) => {
    // Un mismo cliente puede tener servicios en la misma hora si son con
    // estilistas distintos; solo es duplicado si coincide hora + estilista.
    const slotsExistentes = new Set(
      citaExistente.servicios.map((s) => `${s.horaInicio}-${s.estilista}`),
    );
    const nuevosServicios = cita.servicios.filter(
      (s) => !slotsExistentes.has(`${s.horaInicio}-${s.estilista}`),
    );
    const huboDuplicados = nuevosServicios.length < cita.servicios.length;
    if (huboDuplicados) {
      handleAlert(
        `Servicio ya agendado para cliente: "${citaExistente.nombreCliente}"`,
        "error",
      );
    }
    if (nuevosServicios.length === 0) return;

    const serviciosFinales = [...citaExistente.servicios, ...nuevosServicios];
    if (citaTieneServiciosSobrepuestos(serviciosFinales)) {
      handleAlert(
        "Hay servicios con horarios que se sobreponen. Corrige las horas antes de guardar.",
        "error",
      );
      return;
    }

    await window.api.updateCita({
      ...citaExistente,
      servicios: serviciosFinales,
      estado: cita.estado,
    });
    getCitasFromDB(fecha);
    setCita(initialContextData.cita);
    setIsBooking(false);
    handleAlert("Cita actualizada", "success");
  };

  const guardarCitaNueva = async () => {
    if (citaTieneServiciosSobrepuestos(cita.servicios)) {
      handleAlert(
        "Hay servicios con horarios que se sobreponen. Corrige las horas antes de guardar.",
        "error",
      );
      return;
    }

    const citaToSave = {
      ...cita,
      nombreCliente: cita.nombreCliente.trim(),
      id: `${fecha}-${cita.clienteId}`,
      servicios: cita.servicios,
      fechaCreacion: getCurrentDate().formattedDate,
      horaCreacion: getCurrentTime(),
    };
    console.log("Guardando nueva cita:", citaToSave);
    const savedCita = await window.api.addCita(citaToSave);
    setCitas((prevCitas) => [...prevCitas, savedCita]);
    setCita(initialContextData.cita);
    setIsBooking(false);
    handleAlert("Cita guardada con éxito", "success");
  };

  const guardarCita = async () => {
    if (isGuardandoCitaRef.current) return;
    isGuardandoCitaRef.current = true;
    try {
      if (!cita.clienteId) {
        handleAlert(
          "Selecciona un cliente de la lista o guárdalo como nuevo antes de continuar",
          "error",
        );
        return;
      }
      const citaExistente = await window.api.getCitaByFechaClienteId(
        fecha,
        cita.clienteId,
      );
      if (citaExistente) {
        await guardarCitaExistente(citaExistente);
      } else {
        await guardarCitaNueva();
      }
    } catch (error) {
      console.error("Error saving cita:", error);
      handleAlert("Error al guardar la cita", "error");
    } finally {
      isGuardandoCitaRef.current = false;
    }
  };

  const searchClienteByNombre = async (nombre: string) => {
    try {
      const cliente = await window.api.getCliente(nombre);
      return cliente || null;
    } catch (error) {
      console.error("Error searching cliente by nombre:", error);
      return null;
    }
  };

  const searchClientesByNombre = async (nombre: string) => {
    try {
      const cliente = await window.api.getClientesByNombre(nombre);
      return cliente || null;
    } catch (error) {
      console.error("Error searching cliente by nombre:", error);
      return null;
    }
  };

  const searchClienteByPhone = async (telefono: string) => {
    try {
      const clientes = await window.api.getClientes();
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.telefono === telefono,
      );
      return clienteEncontrado || null;
    } catch (error) {
      console.error("Error searching cliente by telefono:", error);
      return null;
    }
  };

  const addCliente = async (cliente: Cliente) => {
    if (!cliente.nombre || !cliente.telefono) {
      handleAlert("Nombre y teléfono son obligatorios", "error");
      return null;
    }

    try {
      const newCliente = await window.api.addCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo || "",
        lastVisit: cliente.lastVisit || "",
      });
      handleAlert("Cliente agregado con éxito", "success");
      return newCliente;
    } catch (error) {
      console.error("Error adding cliente:", error);
      handleAlert("Error al agregar cliente", "error");
      return null;
    }
  };

  useEffect(() => {
    getCitasFromDB(fecha);
  }, [fecha]);

  return (
    <AgendaContext.Provider
      value={{
        fecha,
        setFecha,
        minDuration,
        setMinDuration,
        isCitaOpen,
        setIsCitaOpen,
        isBooking,
        setIsBooking,
        citas,
        setCitas,
        currentPage,
        setCurrentPage,
        cita,
        setCita,
        handleEditCita,
        addServiceToCita,
        removeServiceFromCita,
        updateDuracion,
        handleCancelarCita,
        updateService,
        guardarCita,
        handleAlert,
        searchClienteByNombre,
        searchClientesByNombre,
        searchClienteByPhone,
        addCliente,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};

export function useAgendaContext() {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error(
      "useAgendaContext must be used within a AgendaContextProvider",
    );
  }
  return context;
}
