import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";
import { globalData } from "../mock/globalData";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type Cliente = {
  id: number;
  nombre: string;
  phone: string;
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
  addCliente: (cliente: Cliente) => void;
  editCliente: (rowIndex: number, updatedCliente: Cliente) => void;
  removeCliente: (id: number) => void;
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

  const getClientes = () => {
    // Lógica para obtener los datos de los clientes
    console.log("Obteniendo datos de clientes...");
    setDataTable([...globalData.clientes]);
    return globalData.clientes;
  };

  const addCliente = (cliente: Cliente) => {
    globalData.clientes.push({
      ...cliente,
      id: Math.max(...globalData.clientes.map((c) => c.id), 0) + 1,
      lastVisit: cliente.lastVisit || "",
    });
    setDataTable([...globalData.clientes]);
    handleAlert("Cliente agregado con éxito", "success");
  };

  const editCliente = (rowIndex: number, updatedCliente: Cliente) => {
    globalData.clientes[rowIndex] = {
      ...globalData.clientes[rowIndex],
      ...updatedCliente,
    };
    setDataTable([...globalData.clientes]);
    handleAlert("Cliente actualizado con éxito", "success");
  };

  const removeCliente = (id: number) => {
    globalData.clientes = globalData.clientes.filter(
      (cliente) => cliente.id !== id
    );
    setDataTable([...globalData.clientes]);
    handleAlert("Cliente eliminado con éxito", "success");
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
