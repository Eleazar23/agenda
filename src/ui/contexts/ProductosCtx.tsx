import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";
import { globalData } from "../mock/globalData";
import { Producto } from "../types/Producto";

type Alert = "success" | "error" | "info" | "warning";

type Props = {
  children: React.ReactNode;
};

type ProductosContextType = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAgregar: boolean;
  setIsAgregar: React.Dispatch<React.SetStateAction<boolean>>;
  isBorrar: boolean;
  setIsBorrar: React.Dispatch<React.SetStateAction<boolean>>;
  dataTable: Array<Producto>;
  setDataTable: React.Dispatch<React.SetStateAction<Array<Producto>>>;
  handleAlert: (message: string, alertType: Alert) => void;
  addProducto: (producto: Producto) => void;
  editProducto: (rowIndex: number, updatedProducto: Producto) => void;
  removeProducto: (id: number) => void;
};

export const ProductosContext = createContext<ProductosContextType | null>(
  null,
);

const initialContextData = {
  isEditing: false,
  isAgregar: false,
  isBorrar: false,
  dataTable: [],
};

export const ProductosCtxProvider = ({ children }: Props) => {
  const [isEditing, setIsEditing] = useState(initialContextData.isEditing);
  const [isAgregar, setIsAgregar] = useState(initialContextData.isAgregar);
  const [isBorrar, setIsBorrar] = useState(initialContextData.isBorrar);
  const [dataTable, setDataTable] = useState<Array<Producto>>(
    initialContextData.dataTable,
  );
  const { enqueueSnackbar } = useSnackbar();

  const getProductosData = () => {
    // Lógica para obtener los datos de los clientes
    console.log("Obteniendo datos de productos...");
    setDataTable([...globalData.productos]);
    return globalData.productos;
  };

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const addProducto = (producto: Producto) => {
    const newProducto = {
      ...producto,
      displayName:
        producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1),
    };
    globalData.productos.push(newProducto);
    setDataTable([...globalData.productos]);
    handleAlert("Producto agregado con éxito", "success");
  };

  const editProducto = (rowIndex: number, updatedProducto: Producto) => {
    globalData.productos[rowIndex] = {
      ...globalData.productos[rowIndex],
      ...updatedProducto,
    };
    setDataTable([...globalData.productos]);
    handleAlert("Producto actualizado con éxito", "success");
  };

  const removeProducto = (id: number) => {
    globalData.productos = globalData.productos.filter(
      (producto) => producto.id !== id,
    );
    setDataTable([...globalData.productos]);
    handleAlert("Producto eliminado con éxito", "success");
  };

  React.useEffect(() => {
    getProductosData();
  }, []);

  return (
    <ProductosContext.Provider
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
        addProducto,
        editProducto,
        removeProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};

export function useProductosCtx() {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error(
      "useProductosCtx must be used within a ProductosCtxProvider",
    );
  }
  return context;
}
