import React, { useState, createContext, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import { globalData } from "../mock/globalData";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type Estilista = {
  id: number;
  name: string;
  phone: string;
};

type EstilistasData = {
  isEditing: boolean;
  isAgregar: boolean;
  isBorrar: boolean;
  dataTable: Array<Estilista> | [];
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
  addEstilista: (estilista: Estilista) => void;
  editEstilista: (rowIndex: number, updatedEstilista: Estilista) => void;
  removeEstilista: (id: number) => void;
};

export const ClientesContext = createContext<EstilistasContexType | null>(null);

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

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getData = () => {
    setDataTable(globalData.estilistas);
    return globalData.estilistas;
  };

  const addEstilista = (estilista: Estilista) => {
    // const id = dataTable.length + 1;
    // estilista.id = id;
    globalData.estilistas = [...globalData.estilistas, {
      ...estilista,
      displayName:
        estilista.name.charAt(0).toUpperCase() + estilista.name.slice(1),
    }];
    getData();
  };

  const editEstilista = (rowIndex: number, updatedEstilista: Estilista) => {
    globalData.estilistas[rowIndex] = {
      ...globalData.estilistas[rowIndex],
      ...updatedEstilista,
    };
    setDataTable([...globalData.estilistas]);
    handleAlert("Estilista actualizado con éxito", "success");
  }

  const removeEstilista = (id: number) => {
    globalData.estilistas = globalData.estilistas.filter((estilista) => estilista.id !== id);
    getData();
    handleAlert("Estilista eliminado con éxito", "success");
  };

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
        addEstilista,
        editEstilista,
        removeEstilista,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};

export function useEstilistasCtx() {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error(
      "useEstilistasCtx must be used within a EstilistasCtxProvider"
    );
  }
  return context;
}
