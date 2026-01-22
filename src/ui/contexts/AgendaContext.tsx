import React, { useState, createContext, useContext, useEffect } from "react";
import { getCurrentDate } from "../utils/utils";
import { globalData } from "../mock/globalData";
import { Cita } from "../types/Cita";
import { Servicio } from "../types/Servicio";
import { useSnackbar } from "notistack";
import { Cliente } from "../types/Cliente";

type Props = {
  children: React.ReactNode;
};

type Alert = "success" | "error" | "info" | "warning";

type NewCita = Cita & {
  servicios: [] | Array<any>;
};

type TempService = Cita & {
  cellID: string;
  estilista: string;
  horaInicio: string;
  duracion: number;
};

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
  cita: NewCita;
  setCita: React.Dispatch<React.SetStateAction<NewCita>>;
  handleEditCita: (idCita: number, newCitaData: Cita) => void;
  addServiceToCita: (servicio: TempService) => void;
  removeServiceFromCita: (servicio: TempService) => void;
  updateDuracion: (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => void;
  handleCancelarCita: () => void;
  updateService: (cellID: string, updatedService: Servicio) => void;
  guardarCita: () => void;
  handleAlert: (message: string, alertType: Alert) => void;
  searchClienteByNombre: (nombre: string) => Cliente | null;
  searchClienteByPhone: (phone: string) => Cliente | null;
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
    id: 0,
    rowIndex: 0,
    fecha: "",
    estilista: "",
    nombreCliente: "",
    telefonoCliente: "",
    servicio: {
      id: 0,
      nombre: "",
      precio: "",
    },
    servicios: [],
    horaInicio: "",
    horaFin: "",
    duracion: 30,
    estado: "sin confirmar",
    metodoDePago: "",
    notas: "",
  },
  currentPage: "clientes",
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
  const [cita, setCita] = useState<NewCita>(initialContextData.cita);
  const [currentPage, setCurrentPage] = useState(
    initialContextData.currentPage,
  );

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const handleEditCita = (idCita: number, newCitaData: Cita) => {
    const citaToEditIndex = globalData.citas.findIndex(
      (cita) => cita.id === idCita,
    );
    if (citaToEditIndex !== -1) {
      
      if (newCitaData.estado === "cancelado") {
        const firstArrPart = globalData.citas.slice(0, citaToEditIndex);
        const secondArrPart = globalData.citas.slice(citaToEditIndex + 1);
        globalData.citas = [...firstArrPart, ...secondArrPart];
        setCitas([...globalData.citas]);
        return;
      }
        
      globalData.citas[citaToEditIndex] = {
        ...globalData.citas[citaToEditIndex],
        ...newCitaData,
      };
      setCitas([...globalData.citas]);
    }
  };

  const addServiceToCita = (servicio: TempService) => {
    console.log("Adding service to cita:", servicio);
    setIsBooking(() => true);
    setCita((prev) => {
      return {
        ...prev,
        servicios: [...prev.servicios, servicio],
      };
    });
  };

  const removeServiceFromCita = (servicio: TempService) => {
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

  const guardarCita = () => {
    // Lógica para guardar la cita
    const nuevasCitas = cita.servicios.map((servicio, index) => ({
      id: citas.length + index + 1,
      rowIndex: servicio.rowIndex,
      fecha: servicio.fecha,
      estilista: servicio.estilista,
      nombreCliente: cita.nombreCliente,
      telefonoCliente: cita.telefonoCliente,
      servicio: servicio.servicio,
      horaInicio: servicio.horaInicio,
      horaFin: servicio.horaFin,
      duracion: servicio.duracion,
      estado: cita.estado,
      metodoDePago: cita.metodoDePago,
      notas: cita.notas,
    }));
    console.log("Nuevas citas a guardar:", nuevasCitas);
    // setCitas((prevCitas) => [...prevCitas, ...nuevasCitas]);
    globalData.citas = [...globalData.citas, ...nuevasCitas];
    setCitas(() => [...globalData.citas]);
    setCita(() => initialContextData.cita);
    setIsBooking(() => false);
  };

  const searchClienteByNombre = (nombre: string) => {
    const clienteEncontrado = globalData.clientes.find(
      (cliente) => cliente.nombre === nombre,
    );
    return clienteEncontrado || null;
  };

  const searchClienteByPhone = (phone: string) => {
    const clienteEncontrado = globalData.clientes.find(
      (cliente) => cliente.phone === phone,
    );
    return clienteEncontrado || null;
  };

  useEffect(() => {
    const citasByFecha = globalData.citas.filter(
      (cita) => cita.fecha === fecha && cita.estado !== "cancelado",
    );
    console.log("Citas for fecha", fecha, citasByFecha);
    setCitas(() => [...citasByFecha]);
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
        searchClienteByPhone,
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
      "useSideBarContext must be used within a AgendaContextProvider",
    );
  }
  return context;
}
