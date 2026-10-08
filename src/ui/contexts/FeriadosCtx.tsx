import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { Feriado } from "../types/Feriado";
import { getCurrentDate } from "../utils/utils";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type FeriadosContextType = {
  feriados: Array<Feriado>;
  handleAlert: (message: string, alertType: Alert) => void;
  fetchFeriadosByAnio: (anio: number) => Promise<void>;
  addFeriado: (fecha: string, nombre: string) => Promise<void>;
  removeFeriado: (id: number) => Promise<void>;
};

export const FeriadosContext = createContext<FeriadosContextType | null>(null);

export const FeriadosCtxProvider = ({ children }: Props) => {
  const [feriados, setFeriados] = useState<Array<Feriado>>([]);
  // El año actualmente cargado; se usa para volver a traer la lista tras
  // agregar/eliminar un feriado, ya que la consulta a la BD está filtrada
  // por año (no se guarda la lista completa en memoria).
  const anioActualRef = useRef(getCurrentDate().year);
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getFeriadosData = async (anio: number) => {
    try {
      const data = await window.api.getFeriadosByAnio(anio);
      setFeriados(data);
    } catch (error) {
      console.error("Error loading feriados:", error);
      handleAlert("Error al cargar feriados", "error");
    }
  };

  const fetchFeriadosByAnio = async (anio: number) => {
    anioActualRef.current = anio;
    await getFeriadosData(anio);
  };

  const addFeriado = async (fecha: string, nombre: string) => {
    try {
      await window.api.addFeriado({ fecha, nombre });
      await getFeriadosData(anioActualRef.current);
      handleAlert("Feriado agregado", "success");
    } catch (error: any) {
      console.error("Error adding feriado:", error);
      const message = error?.message?.includes("DUPLICATE_FIELD:fecha")
        ? "Ya existe un feriado registrado en esa fecha"
        : "Error al agregar el feriado";
      handleAlert(message, "error");
    }
  };

  const removeFeriado = async (id: number) => {
    try {
      await window.api.deleteFeriado(id);
      setFeriados((prev) => prev.filter((f) => f.id !== id));
      handleAlert("Feriado eliminado", "success");
    } catch (error) {
      console.error("Error deleting feriado:", error);
      handleAlert("Error al eliminar el feriado", "error");
    }
  };

  useEffect(() => {
    getFeriadosData(anioActualRef.current);
  }, []);

  return (
    <FeriadosContext.Provider
      value={{ feriados, handleAlert, fetchFeriadosByAnio, addFeriado, removeFeriado }}
    >
      {children}
    </FeriadosContext.Provider>
  );
};

export function useFeriadosCtx() {
  const context = useContext(FeriadosContext);
  if (!context) {
    throw new Error("useFeriadosCtx must be used within a FeriadosCtxProvider");
  }
  return context;
}
