import React, { useState, createContext, useContext } from "react";
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
  addEstilista: (estilista: Estilista) => void;
  editEstilista: (rowIndex: number, updatedEstilista: Estilista) => void;
  removeEstilista: (id: number) => void;
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

  const getEstilistasData = () => {
    // Lógica para obtener los datos de los clientes
    console.log("Obteniendo datos de estilistas...");
    setDataTable([...globalData.estilistas]);
    return globalData.estilistas;
  };

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const addEstilista = (estilista: Estilista) => {
    const newEstilista = {
      ...estilista,
      displayName:
        estilista.name.charAt(0).toUpperCase() + estilista.name.slice(1),
    };
    globalData.estilistas.push(newEstilista);
    setDataTable([...globalData.estilistas]);
    handleAlert("Estilista agregado con éxito", "success");
  };

  const editEstilista = (rowIndex: number, updatedEstilista: Estilista) => {
    globalData.estilistas[rowIndex] = {
      ...globalData.estilistas[rowIndex],
      ...updatedEstilista,
    };
    setDataTable([...globalData.estilistas]);
    handleAlert("Estilista actualizado con éxito", "success");
  };

  const removeEstilista = (id: number) => {
    globalData.estilistas = globalData.estilistas.filter(
      (estilista) => estilista.id !== id
    );
    setDataTable([...globalData.estilistas]);
    handleAlert("Estilista eliminado con éxito", "success");
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
