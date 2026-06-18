import React, { useState, createContext, useContext } from "react";
import { useSnackbar } from "notistack";
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
  addProducto: (producto: Producto) => Promise<void>;
  editProducto: (rowIndex: number, updatedProducto: Producto) => Promise<void>;
  removeProducto: (id: number) => Promise<void>;
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

  const getProductosData = async () => {
    try {
      console.log("Obteniendo datos de productos...");
      const productos = await window.api.getProductos();
      setDataTable(productos);
      return productos;
    } catch (error) {
      console.error("Error loading productos:", error);
      handleAlert("Error al cargar productos", "error");
      return [];
    }
  };

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const addProducto = async (producto: Producto) => {
    try {
      const newProducto = await window.api.addProducto({
        nombre: producto.nombre,
        marca: producto.marca,
        precio: producto.precio,
        descripcion: producto.descripcion,
        stock: producto.stock,
      });
      setDataTable((prev) => [...prev, newProducto]);
      handleAlert("Producto agregado con éxito", "success");
    } catch (error) {
      console.error("Error adding producto:", error);
      handleAlert("Error al agregar producto", "error");
    }
  };

  const editProducto = async (rowIndex: number, updatedProducto: Producto) => {
    try {
      await window.api.updateProducto(updatedProducto);
      setDataTable((prev) =>
        prev.map((producto, index) =>
          index === rowIndex ? updatedProducto : producto
        )
      );
      handleAlert("Producto actualizado con éxito", "success");
    } catch (error) {
      console.error("Error updating producto:", error);
      handleAlert("Error al actualizar producto", "error");
    }
  };

  const removeProducto = async (id: number) => {
    try {
      await window.api.deleteProducto(id);
      setDataTable((prev) => prev.filter((producto) => producto.id !== id));
      handleAlert("Producto eliminado con éxito", "success");
    } catch (error) {
      console.error("Error deleting producto:", error);
      handleAlert("Error al eliminar producto", "error");
    }
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
