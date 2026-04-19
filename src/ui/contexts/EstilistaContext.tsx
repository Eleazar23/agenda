import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type Estilista = {
  id: number;
  name: string;
  telefono: string;
  displayName?: string;
};

type EstilistasContexType = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAgregar: boolean;
  setIsAgregar: React.Dispatch<React.SetStateAction<boolean>>;
  isBorrar: boolean;
  setIsBorrar: React.Dispatch<React.SetStateAction<boolean>>;
  dataTable: Array<Estilista>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Estilista>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addEstilista: (estilista: Estilista) => Promise<void>;
  editEstilista: (rowIndex: number, updatedEstilista: Estilista) => Promise<void>;
  removeEstilista: (id: number) => Promise<void>;
};

export const EstilistasContext = createContext<EstilistasContexType | null>(
  null
);

const initialContextData = {
  isEditing: false,
  isAgregar: false,
  isBorrar: false,
  dataTable: [],
};

export const EstilistasCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Estilista>>(
    initialContextData.dataTable
  );
  const { enqueueSnackbar } = useSnackbar();

  const getEstilistasData = async () => {
    try {
      console.log("Obteniendo datos de estilistas...");
      const estilistas = await window.api.getEstilistas();
      setDataTable(estilistas);
      return estilistas;
    } catch (error) {
      console.error("Error loading estilistas:", error);
      handleAlert("Error al cargar estilistas", "error");
      return [];
    }
  };

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const addEstilista = async (estilista: Estilista) => {
    try {
      const newEstilista = await window.api.addEstilista({
        name: estilista.name,
        telefono: estilista.telefono,
        displayName:
          estilista.name.charAt(0).toUpperCase() + estilista.name.slice(1),
      });
      setDataTable((prev) => [...prev, newEstilista]);
      handleAlert("Estilista agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding estilista:", error);
      handleAlert("Error al agregar estilista", "error");
    }
  };

  const editEstilista = async (rowIndex: number, updatedEstilista: Estilista) => {
    try {
      await window.api.updateEstilista(updatedEstilista);
      setDataTable((prev) =>
        prev.map((estilista) =>
          estilista.id === updatedEstilista.id ? updatedEstilista : estilista
        )
      );
      handleAlert("Estilista actualizado con éxito", "success");
    } catch (error) {
      console.error("Error updating estilista:", error);
      handleAlert("Error al actualizar estilista", "error");
    }
  };

  const removeEstilista = async (id: number) => {
    try {
      await window.api.deleteEstilista(id);
      setDataTable((prev) => prev.filter((estilista) => estilista.id !== id));
      handleAlert("Estilista eliminado con éxito", "success");
    } catch (error) {
      console.error("Error deleting estilista:", error);
      handleAlert("Error al eliminar estilista", "error");
    }
  };

  React.useEffect(() => {
    getEstilistasData();
  }, []);

  return (
    <EstilistasContext.Provider
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
        addEstilista,
        editEstilista,
        removeEstilista,
      }}
    >
      {children}
    </EstilistasContext.Provider>
  );
};

export function useEstilistasCtx() {
  const context = useContext(EstilistasContext);
  if (!context) {
    throw new Error(
      "useEstilistasCtx must be used within a EstilistasCtxProvider"
    );
  }
  return context;
}
