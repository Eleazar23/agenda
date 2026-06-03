import React, { useState, createContext, useContext, useEffect } from "react";
import { getCurrentDate } from "../utils/utils";
import { Cita } from "../types/Cita";
import { Servicio } from "../types/Servicio";
import { useSnackbar } from "notistack";
import { Cliente } from "../types/Cliente";
// import { Producto } from "../types/Producto";
import { ServicioAgendado } from "../types/ServicioAgendado";

type Props = {
  children: React.ReactNode;
};

type Alert = "success" | "error" | "info" | "warning";

// type NewCita = Cita & {
//   servicios: [] | Array<any>;
// };

// type ServicioAgendado = Cita & {
//   cellID: string;
//   estilista: string;
//   horaInicio: string;
//   duracion: number;
// };

// type AgendaData = {
//   fecha: string;
//   minDuration: number;
//   isCitaOpen: boolean;
//   isBooking: boolean;
//   citas: [] | Array<Cita>;
//   cita: NewCita;
//   currentPage: string;
// };

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
  handleEditCita: (idCita: string, newCitaData: Cita) => Promise<void>;
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
  addCliente: (cliente: Cliente) => Promise<void>;
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

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getCitasFromDB = async (fecha: string) => {
    try {
      const citasFromDB = await window.api.getCitasByFecha(fecha);
      // const citasActivas = citasFromDB.filter(
      //   (cita) => cita.estado !== "cancelado",
      // );
      // console.log("Citas for fecha", fecha, citasActivas);
      // setCitas(citasActivas);
      setCitas(citasFromDB);
    } catch (error) {
      console.error("Error loading citas:", error);
      handleAlert("Error al cargar las citas", "error");
    }
  };

  const handleEditCita = async (idCita: string, newCitaData: Cita) => {
    try {
      if (newCitaData.estado === "cancelado") {
        await window.api.deleteCita(idCita);
        // await window.api.updateCita(newCitaData);
        // const updatedCitas = citas.filter((cita) => cita.id !== idCita);
        // setCitas(updatedCitas);
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

      await window.api.updateCita(newCitaData);
      getCitasFromDB(fecha);
      handleAlert("Cita actualizada", "success");
    } catch (error) {
      console.error("Error updating cita:", error);
      handleAlert("Error al actualizar la cita", "error");
    }
  };

  const addServiceToCita = (servicio: ServicioAgendado) => {
    console.log("Adding service to cita:", servicio);
    setIsBooking(() => true);
    setCita((prev) => {
      return {
        ...prev,
        fecha: fecha,
        servicios: [...prev.servicios, servicio],
      };
    });
  };

  const removeServiceFromCita = (servicio: ServicioAgendado) => {
    const updatedServicios = cita.servicios.filter(
      (s) => s.cellID !== servicio.cellID,
    );
    setCita((prev) => ({
      ...prev,
      servicios: updatedServicios,
    }));
  };

  const updateService = (cellID: string, updatedService: Servicio) => {
    const serviceToUpdateIndex = cita.servicios.findIndex(
      (s) => s.cellID === cellID,
    );
    if (serviceToUpdateIndex !== -1) {
      const updatedServicios = [...cita.servicios];
      updatedServicios[serviceToUpdateIndex] = {
        ...updatedServicios[serviceToUpdateIndex],
        servicio: updatedService,
      };
      setCita((prev) => ({
        ...prev,
        fecha: fecha,
        servicios: updatedServicios,
      }));
    }
  };

  const updateDuracion = (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => {
    const servicioToUpdateIndex = cita.servicios.findIndex(
      (s) => s.cellID === cellID,
    );
    if (servicioToUpdateIndex !== -1) {
      const updatedServicios = [...cita.servicios];
      updatedServicios[servicioToUpdateIndex] = {
        ...updatedServicios[servicioToUpdateIndex],
        duracion: newDuracion,
        horaFin: horaFin,
      };
      setCita((prev) => ({
        ...prev,
        servicios: updatedServicios,
      }));
    }
  };

  const handleCancelarCita = () => {
    setCita(initialContextData.cita);
    setIsBooking(() => false);
  };

  const guardarCita = async () => {
    try {
      // const nuevasCitas = cita.servicios.map((servicio) => ({
      //   rowIndex: servicio.rowIndex,
      //   fecha: servicio.fecha,
      //   estilista: servicio.estilista,
      //   nombreCliente: cita.nombreCliente,
      //   telefonoCliente: cita.telefonoCliente,
      //   servicio: servicio.servicio,
      //   horaInicio: servicio.horaInicio,
      //   horaFin: servicio.horaFin,
      //   duracion: servicio.duracion,
      //   estado: cita.estado,
      //   metodoDePago: cita.metodoDePago,
      //   notas: cita.notas,
      // }));

      // Save citas sequentially to avoid race condition with auto-increment IDs
      // const savedCitas: Cita[] = [];
      // for (const citaData of nuevasCitas) {
      //   const savedCita = await window.api.addCita(citaData);
      //   savedCitas.push(savedCita);
      // }
      const newID = `${fecha}-${cita.nombreCliente}`;
      const isCitaInDB = await window.api.getCitaByFechaCliente(fecha, cita.nombreCliente);
      if (isCitaInDB) {
        const updateServicios = [...isCitaInDB.servicios, ...cita.servicios]
        const updatedCitaData = {
          ...isCitaInDB,
          servicios: updateServicios,
          estado: cita.estado,}
        await window.api.updateCita(updatedCitaData);
        getCitasFromDB(fecha);
        handleAlert("Cita actualizada", "success");
        return;
      }
      const citaToSave = {
        ...cita,
        id: newID,
      };
      console.log("Cita to save:", cita);
      const savedCita = await window.api.addCita(citaToSave);

      setCitas((prevCitas) => [...prevCitas, savedCita]);
      setCita(initialContextData.cita);
      setIsBooking(false);
      handleAlert("Cita guardada con éxito", "success");
    } catch (error) {
      console.error("Error saving cita:", error);
      handleAlert("Error al guardar la cita", "error");
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
      return;
    }

    try {
      const newCliente = await window.api.addCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo || "",
        lastVisit: cliente.lastVisit || "",
      });
      handleAlert("Cliente agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding cliente:", error);
      handleAlert("Error al agregar cliente", "error");
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
