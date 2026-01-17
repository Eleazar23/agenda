import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";
import { Servicio } from "../types/Servicio";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type ServiciosContextType = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAgregar: boolean;
  setIsAgregar: React.Dispatch<React.SetStateAction<boolean>>;
  isBorrar: boolean;
  setIsBorrar: React.Dispatch<React.SetStateAction<boolean>>;
  dataTable: Array<Servicio>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Servicio>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addServicio: (servicio: Servicio) => void;
  editServicio: (rowIndex: number, updatedServicio: Servicio) => void;
  removeServicio: (id: number) => void;
};

export const ServiciosContext = createContext<ServiciosContextType | null>(
  null
);

const initialContextData = {
  isEditing: false,
  isAgregar: false,
  isBorrar: false,
  dataTable: [],
};

const mockServicios: Servicio[] = [
  { id: 1, nombre: "Corte de cabello H", precio: "150" },
  { id: 2, nombre: "Corte de cabello M", precio: "200" },
  { id: 3, nombre: "Manicura", precio: "100" },
  { id: 4, nombre: "Pedicura", precio: "120" },
  { id: 5, nombre: "Coloración", precio: "500" },
  { id: 6, nombre: "Peinado", precio: "250" },
];

export const ServiciosCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Servicio>>(mockServicios);
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const addServicio = (servicio: Servicio) => {
    const newServicio = {
      ...servicio,
      id: Date.now(),
    };
    setDataTable((prev) => [...prev, newServicio]);
    handleAlert("Servicio agregado con éxito", "success");
  };

  const editServicio = (rowIndex: number, updatedServicio: Servicio) => {
    setDataTable((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], ...updatedServicio };
      return updated;
    });
    handleAlert("Servicio actualizado con éxito", "success");
  };

  const removeServicio = (id: number) => {
    setDataTable((prev) => prev.filter((servicio) => servicio.id !== id));
    handleAlert("Servicio eliminado con éxito", "success");
  };

  return (
    <ServiciosContext.Provider
      value={{
        isEditing,
        setIsEditing,
        isAgregar,
        setIsAgregar,
        isBorrar,
        setIsBorrar,
        dataTable,
        setDataTable,
        handleAlert,
        addServicio,
        editServicio,
        removeServicio,
      }}
    >
      {children}
    </ServiciosContext.Provider>
  );
};

export function useServiciosCtx() {
  const context = useContext(ServiciosContext);
  if (!context) {
    throw new Error(
      "useServiciosCtx must be used within a ServiciosCtxProvider"
    );
  }
  return context;
}
