import React, { useState, createContext, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Nota } from "../types/Nota";
import { useAgendaContext } from "./AgendaContext";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type NotasContextType = {
  dataTable: Array<Nota>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Nota>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addNota: (nota: Omit<Nota, "id">) => Promise<void>;
  editNota: (nota: Nota) => Promise<void>;
  toggleNotaEstado: (nota: Nota) => Promise<void>;
  removeNota: (id: number) => Promise<void>;
  isNotasOpen: boolean;
  toggleNotasOpen: () => void;
  pendingCount: number;
};

export const NotasContext = createContext<NotasContextType | null>(null);

export const NotasCtxProvider = ({ children }: Props) => {
  const [dataTable, setDataTable] = useState<Array<Nota>>([]);
  const [isNotasOpen, setIsNotasOpen] = useState(false);
  const { fecha } = useAgendaContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getNotasByFecha = async (fecha: string) => {
    try {
      const notas = await window.api.getNotasByFecha(fecha);
      setDataTable(notas);
    } catch (error) {
      console.error("Error loading notas:", error);
      handleAlert("Error al cargar notas", "error");
    }
  };

  const addNota = async (nota: Omit<Nota, "id">) => {
    try {
      const newNota = await window.api.addNota(nota);
      if (newNota.fecha === fecha) {
        setDataTable((prev) => [...prev, newNota]);
      }
      handleAlert("Nota agregada con éxito", "success");
    } catch (error) {
      console.error("Error adding nota:", error);
      handleAlert("Error al agregar nota", "error");
    }
  };

  const editNota = async (updatedNota: Nota) => {
    try {
      await window.api.updateNota(updatedNota);
      setDataTable((prev) =>
        updatedNota.fecha === fecha
          ? prev.map((nota) => (nota.id === updatedNota.id ? updatedNota : nota))
          : prev.filter((nota) => nota.id !== updatedNota.id),
      );
      handleAlert("Nota actualizada con éxito", "success");
    } catch (error) {
      console.error("Error updating nota:", error);
      handleAlert("Error al actualizar nota", "error");
    }
  };

  const toggleNotaEstado = async (nota: Nota) => {
    await editNota({ ...nota, estado: !nota.estado });
  };

  const removeNota = async (id: number) => {
    try {
      await window.api.deleteNota(id);
      setDataTable((prev) => prev.filter((nota) => nota.id !== id));
      handleAlert("Nota eliminada con éxito", "success");
    } catch (error) {
      console.error("Error deleting nota:", error);
      handleAlert("Error al eliminar nota", "error");
    }
  };

  const toggleNotasOpen = () => setIsNotasOpen((prev) => !prev);

  const pendingCount = dataTable.filter((nota) => !nota.estado).length;

  useEffect(() => {
    getNotasByFecha(fecha);
  }, [fecha]);

  return (
    <NotasContext.Provider
      value={{
        dataTable,
        setDataTable,
        handleAlert,
        addNota,
        editNota,
        toggleNotaEstado,
        removeNota,
        isNotasOpen,
        toggleNotasOpen,
        pendingCount,
      }}
    >
      {children}
    </NotasContext.Provider>
  );
};

export function useNotasCtx() {
  const context = useContext(NotasContext);
  if (!context) {
    throw new Error("useNotasCtx must be used within a NotasCtxProvider");
  }
  return context;
}
