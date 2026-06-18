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
  addServicio: (servicio: Servicio) => Promise<void>;
  editServicio: (rowIndex: number, updatedServicio: Servicio) => Promise<void>;
  removeServicio: (id: number) => Promise<void>;
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

// const mockServicios: Servicio[] = [
//   { id: 1, nombre: "Corte de cabello H", precio: "150" },
//   { id: 2, nombre: "Corte de cabello M", precio: "200" },
//   { id: 3, nombre: "Manicura", precio: "100" },
//   { id: 4, nombre: "Pedicura", precio: "120" },
//   { id: 5, nombre: "Coloración", precio: "500" },
//   { id: 6, nombre: "Peinado", precio: "250" },
// ];

export const ServiciosCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Servicio>>([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getServicios = async () => {
    try {
      const servicios = await window.api.getServicios();
      setDataTable(servicios);
      return servicios;
    } catch (error) {
      console.error("Error loading servicios:", error);
      handleAlert("Error al cargar servicios", "error");
      return [];
    }
  };

  const addServicio = async (servicio: Servicio) => {
    try {
      const newServicio = await window.api.addServicio({
        nombre: servicio.nombre,
        precio: servicio.precio,
      });
      setDataTable((prev) => [...prev, newServicio]);
      handleAlert("Servicio agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding servicio:", error);
      handleAlert("Error al agregar servicio", "error");
    }
  };

  const editServicio = async (rowIndex: number, updatedServicio: Servicio) => {
    try {
      await window.api.updateServicio(updatedServicio);
      setDataTable((prev) =>
        prev.map((servicio, index) =>
          index === rowIndex ? updatedServicio : servicio
        )
      );
      handleAlert("Servicio actualizado con éxito", "success");
    } catch (error) {
      console.error("Error updating servicio:", error);
      handleAlert("Error al actualizar servicio", "error");
    }
  };

  const removeServicio = async (id: number) => {
    try {
      await window.api.deleteServicio(id);
      setDataTable((prev) => prev.filter((servicio) => servicio.id !== id));
      handleAlert("Servicio eliminado con éxito", "success");
    } catch (error) {
      console.error("Error deleting servicio:", error);
      handleAlert("Error al eliminar servicio", "error");
    }
  };

  React.useEffect(() => {
    getServicios();
  }, []);

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
