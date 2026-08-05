import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { getCurrentDate } from "../utils/utils";
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
  handleEditCita: (idCita: string, newCitaData: Cita, productosToUpdate: ProductoInCita[]) => Promise<void>;
  addServiceToCita: (servicio: ServicioAgendado) => void;
  removeServiceFromCita: (servicio: ServicioAgendado) => void;
  updateDuracion: (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => void;
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
    try {
      for (const producto of productos) {
        const productoInDB = await window.api.getProductoById(producto.id);
        if (productoInDB) {
          const newStock = productoInDB.stock - producto.cantidad;
          await window.api.updateProducto({
            ...productoInDB,
            stock: newStock >= 0 ? newStock : 0, // Evitar stock negativo
          });
        }
      }
    } catch (error) {
      console.error("Error updating producto stock:", error);
      handleAlert("Error al actualizar el stock de productos", "error");
    }
  };

  const handleEditCita = async (idCita: string, newCitaData: Cita, productosToUpdate: ProductoInCita[]) => {
    if (isEditandoCitaRef.current) return;
    isEditandoCitaRef.current = true;
    try {
      if (newCitaData.estado === "cancelado") {
        await window.api.deleteCita(idCita);
        getCitasFromDB(fecha);
        handleAlert("Cita cancelada", "info");
        return;
      }

      if (newCitaData.servicios.length === 0) {
        await window.api.deleteCita(idCita);
        getCitasFromDB(fecha);
        handleAlert("Cita eliminada por no tener servicios", "info");
        return;
      }

      await updateProductosStock(productosToUpdate);
      await window.api.updateCita(newCitaData);
      getCitasFromDB(fecha);
      handleAlert("Cita actualizada", "success");
    } catch (error) {
      console.error("Error updating cita:", error);
      handleAlert("Error al actualizar la cita", "error");
    } finally {
      isEditandoCitaRef.current = false;
    }
  };

  const addServiceToCita = (servicio: ServicioAgendado) => {
    setIsBooking(true);
    setCita((prev) => ({
      ...prev,
      fecha,
      servicios: [...prev.servicios, servicio],
    }));
  };

  const removeServiceFromCita = (servicio: ServicioAgendado) => {
    setCita((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((s) => s.cellID !== servicio.cellID),
    }));
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
    updateServicioAgendado(cellID, { servicio: updatedService });
  };

  const getOccupiedRows = (servicio: ServicioAgendado) => {
    const rowsSpan = servicio.duracion / 30;
    return Array.from({ length: rowsSpan }, (_, i) => servicio.rowIndex + i);
  };

  const updateDuracion = (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => {
    const [rowIndexStr, ...estilistaParts] = cellID.split("-");
    const rowIndex = Number(rowIndexStr);
    const estilista = estilistaParts.join("-");
    const rowsSpan = newDuracion / 30;
    const newRowIndexes = Array.from({ length: rowsSpan }, (_, i) => rowIndex + i);

    const citasDelDia = citas.filter((c) => c.fecha === fecha);
    const overlapsExistingCita = citasDelDia.some((c) =>
      c.servicios.some(
        (s) =>
          s.estilista === estilista &&
          getOccupiedRows(s).some((r) => newRowIndexes.includes(r)),
      ),
    );

    const otrosServiciosEnCita = cita.servicios.filter(
      (s) => s.cellID !== cellID,
    );
    const overlapsOwnCita = otrosServiciosEnCita.some(
      (s) =>
        s.estilista === estilista &&
        getOccupiedRows(s).some((r) => newRowIndexes.includes(r)),
    );

    if (overlapsExistingCita || overlapsOwnCita) {
      handleAlert(
        "La hora de fin se sobrepone con otro servicio ya agendado",
        "error",
      );
      return;
    }

    updateServicioAgendado(cellID, { duracion: newDuracion, horaFin });
  };

  const handleCancelarCita = () => {
    setCita(initialContextData.cita);
    setIsBooking(() => false);
  };

  const guardarCitaExistente = async (citaExistente: Cita) => {
    const horasExistentes = new Set(
      citaExistente.servicios.map((s) => s.horaInicio),
    );
    const nuevosServicios = cita.servicios.filter(
      (s) => !horasExistentes.has(s.horaInicio),
    );
    const huboDuplicados = nuevosServicios.length < cita.servicios.length;
    if (huboDuplicados) {
      handleAlert(
        `Servicio ya agendado para cliente: "${citaExistente.nombreCliente}"`,
        "error",
      );
    }
    if (nuevosServicios.length === 0) return;

    await window.api.updateCita({
      ...citaExistente,
      servicios: [...citaExistente.servicios, ...nuevosServicios],
      estado: cita.estado,
    });
    getCitasFromDB(fecha);
    setCita(initialContextData.cita);
    setIsBooking(false);
    handleAlert("Cita actualizada", "success");
  };

  const guardarCitaNueva = async () => {
    const citaToSave = {
      ...cita,
      nombreCliente: cita.nombreCliente.trim(),
      id: `${fecha}-${cita.clienteId}`,
    };
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
