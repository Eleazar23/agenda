import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  lastVisit: string;
};

type ClientesData = {
  isEditing: boolean;
  isAgregar: boolean;
  isBorrar: boolean;
  dataTable: Array<Cliente>;
};

type ClientesContextType = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAgregar: boolean;
  setIsAgregar: React.Dispatch<React.SetStateAction<boolean>>;
  isBorrar: boolean;
  setIsBorrar: React.Dispatch<React.SetStateAction<boolean>>;
  dataTable: Array<Cliente>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Cliente>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addCliente: (cliente: Cliente) => Promise<void>;
  editCliente: (rowIndex: number, updatedCliente: Cliente) => Promise<void>;
  removeCliente: (id: number) => Promise<void>;
};

export const ClientesContext = createContext<ClientesContextType | null>(null);

const initialContextData: ClientesData = {
  isEditing: false,
  isAgregar: false,
  isBorrar: false,
  dataTable: [],
};

export const ClientesCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Cliente>>(
    initialContextData.dataTable
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getClientes = async () => {
    try {
      console.log("Obteniendo datos de clientes...");
      const clientes = await window.api.getClientes();
      setDataTable(clientes);
      return clientes;
    } catch (error) {
      console.error("Error loading clientes:", error);
      handleAlert("Error al cargar clientes", "error");
      return [];
    }
  };

  const addCliente = async (cliente: Cliente) => {
    try {
      const newCliente = await window.api.addCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo || "",
        lastVisit: cliente.lastVisit || "",
      });
      setDataTable((prev) => [...prev, newCliente]);
      handleAlert("Cliente agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding cliente:", error);
      handleAlert("Error al agregar cliente", "error");
    }
  };

  const editCliente = async (rowIndex: number, updatedCliente: Cliente) => {
    try {
      await window.api.updateCliente(updatedCliente);
      setDataTable((prev) =>
        prev.map((cliente, index) =>
          index === rowIndex ? updatedCliente : cliente
        )
      );
      handleAlert("Cliente actualizado con éxito", "success");
    } catch (error) {
      console.error("Error updating cliente:", error);
      handleAlert("Error al actualizar cliente", "error");
    }
  };

  const removeCliente = async (id: number) => {
    try {
      await window.api.deleteCliente(id);
      setDataTable((prev) => prev.filter((cliente) => cliente.id !== id));
      handleAlert("Cliente eliminado con éxito", "success");
    } catch (error) {
      console.error("Error deleting cliente:", error);
      handleAlert("Error al eliminar cliente", "error");
    }
  };

  React.useEffect(() => {
    getClientes();
  }, []);

  return (
    <ClientesContext.Provider
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
        addCliente,
        editCliente,
        removeCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};

export function useClientesCtx() {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientesCtx must be used within a ClientesCtxProvider");
  }
  return context;
}
