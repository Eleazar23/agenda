import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";
import { Gasto } from "../types/Gasto";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type GastosData = {
  isEditing: boolean;
  isAgregar: boolean;
  isBorrar: boolean;
  dataTable: Array<Gasto>;
};

type GastosContextType = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAgregar: boolean;
  setIsAgregar: React.Dispatch<React.SetStateAction<boolean>>;
  isBorrar: boolean;
  setIsBorrar: React.Dispatch<React.SetStateAction<boolean>>;
  dataTable: Array<Gasto>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Gasto>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addGasto: (gasto: Gasto) => Promise<void>;
  editGasto: (rowIndex: number, updatedGasto: Gasto) => Promise<void>;
  removeGasto: (id: number) => Promise<void>;
  totalGastos: number;
  getGastosByFecha: (fecha: string) => Promise<Gasto[] | []>;
  fechaGastos: string;
  setFechaGastos: React.Dispatch<React.SetStateAction<string>>;
};

export const GastosContext = createContext<GastosContextType | null>(null);

const initialContextData: GastosData = {
  isEditing: false,
  isAgregar: false,
  isBorrar: false,
  dataTable: [],
};

export const GastosCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Gasto>>(
    initialContextData.dataTable,
  );
  const [fechaGastos, setFechaGastos] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getGastos = async () => {
    try {
      console.log("Obteniendo datos de gastos...");
      const gastos = await window.api.getGastos();
      setDataTable(gastos);
      return gastos;
    } catch (error) {
      console.error("Error loading gastos:", error);
      handleAlert("Error al cargar gastos", "error");
      return [];
    }
  };

  const getGastosByFecha = async (fecha: string) => {
    try {
      const gastosByFecha = await window.api.getGastosByFecha(fecha);
      setDataTable(gastosByFecha);
      return gastosByFecha;
    } catch (error) {
      console.log("Error al obtener gastos por fecha:", error);
      handleAlert("Error al obtener gasto por fecha", "error");
      return [];
    }
  };

  const addGasto = async (gasto: Gasto) => {
    try {
      const newGasto = await window.api.addGasto({
        proveedorNombre: gasto.proveedorNombre,
        monto: gasto.monto,
        fecha: gasto.fecha,
        categoria: gasto.categoria,
        descripcion: gasto.descripcion,
        metodoPago: gasto.metodoPago,
      });
      //   setDataTable((prev) => [...prev, newGasto]);
      getGastosByFecha(fechaGastos);
      handleAlert("Gasto agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding gasto:", error);
      handleAlert("Error al agregar gasto", "error");
    }
  };

  const editGasto = async (rowIndex: number, updatedGasto: Gasto) => {
    try {
      await window.api.updateGasto(updatedGasto);
    //   setDataTable((prev) =>
    //     prev.map((gasto, index) => (index === rowIndex ? updatedGasto : gasto)),
    //   );
    getGastosByFecha(fechaGastos);
      handleAlert("Gasto actualizado con éxito", "success");
    } catch (error) {
      console.error("Error updating gasto:", error);
      handleAlert("Error al actualizar gasto", "error");
    }
  };

  const removeGasto = async (id: number) => {
    try {
      await window.api.deleteGasto(id);
      setDataTable((prev) => prev.filter((gasto) => gasto.id !== id));
      handleAlert("Gasto eliminado con éxito", "success");
    } catch (error) {
      console.error("Error deleting gasto:", error);
      handleAlert("Error al eliminar gasto", "error");
    }
  };

  const totalGastos = dataTable.reduce(
    (total, gasto) => total + gasto.monto,
    0,
  );

  //   React.useEffect(() => {
  //     getGastos();
  //   }, []);

  React.useEffect(() => {
    getGastosByFecha(fechaGastos);
  }, [fechaGastos]);

  return (
    <GastosContext.Provider
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
        addGasto,
        editGasto,
        removeGasto,
        totalGastos,
        getGastosByFecha,
        fechaGastos,
        setFechaGastos,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
};

export function useGastosCtx() {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error("useGastosCtx must be used within a GastosCtxProvider");
  }
  return context;
}
