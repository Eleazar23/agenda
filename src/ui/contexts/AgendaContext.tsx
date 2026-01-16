import React, { useState, createContext, useContext } from "react";
import { getCurrentDate } from "../utils/utils";
import { globalData } from "../mock/globalData";

type Props = {
  children: React.ReactNode;
};

export type Cliente = {
  nombre: string;
  phone: string;
};

export type Servicio = {
  rowIndex: number;
  cellID: string;
  estilista: string;
  servicio: string;
  precio: string;
  hora: string;
  duracion: number;
  estado: string;
  metododepago: string;
  notas: string;
};

export type Cita = {
  fecha: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicios: [] | Array<Servicio>;
};

export type Modal = {
  fecha: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicio: Servicio;
};

type AgendaData = {
  fecha: string;
  minDuration: number;
  isCitaOpen: boolean;
  isBooking: boolean;
  citas: [] | Array<Cita>;
  cita: Cita;
  currentPage: string;
  modal: Modal;
};

type AgendaContex = {
  agendaData: AgendaData;
  addService: React.Dispatch<React.SetStateAction<any>>;
  updateService: (index: number, newServiceValue: null | string) => void;
  setAgendaData: React.Dispatch<React.SetStateAction<AgendaData>>;
  addCita: React.DispatchWithoutAction;
  removeService: React.Dispatch<React.SetStateAction<any>>;
  updateDuracion: (index: number, newValue: number) => void;
};

export const AgendaContext = createContext<AgendaContex | null>(null);

const initialDate = getCurrentDate().formattedDate;

const initialContextData = {
  fecha: initialDate,
  minDuration: 30,
  isCitaOpen: false,
  isBooking: false,
  citas: globalData.citas,
  cita: {
    fecha: "",
    nombreCliente: "",
    telefonoCliente: "",
    servicios: [],
  },
  currentPage: "agenda",
  modal: {
    fecha: "",
    nombreCliente: "",
    telefonoCliente: "",
    servicio: {
      rowIndex: 0,
      cellID: "",
      estilista: "",
      servicio: "",
      precio: "",
      hora: "",
      duracion: 30,
      estado: "",
      metododepago: "",
      notas: "",
    },
  },
};

export const AgendaContextProvider = ({ children }: Props) => {
  const [agendaData, setAgendaData] = useState<AgendaData>(initialContextData);

  const updateService = (index: number, newServiceValue: null | string) => {
    const { cita } = agendaData;
    const { servicios } = cita;
    let newServicios = servicios;
    const serviceToUpdate = servicios[index];
    const updatedService = {
      ...serviceToUpdate,
      servicio: newServiceValue ? newServiceValue : "",
    };
    newServicios[index] = updatedService;
    setAgendaData({
      ...agendaData,
      cita: { ...cita, servicios: newServicios },
    });
  };

  const updateDuracion = (index: number, newValue: number) => {
    const { cita } = agendaData;
    const { servicios } = cita;
    let newServicios = servicios;
    const serviceToUpdate = servicios[index];
    const updatedService = { ...serviceToUpdate, duracion: newValue };
    newServicios[index] = updatedService;
    setAgendaData({
      ...agendaData,
      cita: { ...cita, servicios: newServicios },
    });
  };

  const addService = (servicio: Servicio) => {
    const { servicios } = agendaData.cita;
    const { rowIndex, estilista, hora, cellID, duracion } = servicio;
    const newService: Servicio = {
      cellID,
      rowIndex,
      estilista,
      servicio: "",
      hora,
      duracion,
      precio: "",
      estado: "sin confirmar",
      notas: "",
      metododepago: "efectivo",
    };
    setAgendaData({
      ...agendaData,
      isBooking: true,
      cita: { ...agendaData.cita, servicios: [...servicios, newService], fecha: agendaData.fecha },
    });
  };

  const addCita = () => {
    const { citas } = agendaData;
    const { cita } = agendaData;
    setAgendaData({
      ...agendaData,
      citas: [...citas, cita],
      cita: initialContextData.cita,
      isBooking: false,
    });
    globalData.citas.push(cita);
    console.log("addCita", agendaData);
  };

  const removeService = (service: Servicio) => {
    const { servicios } = agendaData.cita;
    const filteredServicios = servicios.filter(
      (servicio) => servicio.cellID != service.cellID
    );
    setAgendaData({
      ...agendaData,
      cita: { ...agendaData.cita, servicios: filteredServicios },
    });
  };

  return (
    <AgendaContext.Provider
      value={{
        agendaData,
        setAgendaData,
        addService,
        removeService,
        addCita,
        updateService,
        updateDuracion,
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
      "useSideBarContext must be used within a AgendaContextProvider"
    );
  }
  return context;
}
