import { ProductoInCita } from "../types/Producto";

export const updateProductosStock = async (productos: ProductoInCita[]) => {
    try {
      for (const producto of productos) {
        const productoInDB = await window.api.getProductoById(producto.id);
        if (productoInDB) {
          const newStock = productoInDB.stock - producto.cantidad;
          await window.api.updateProducto({
            ...productoInDB,
            stock: newStock >= 0 ? newStock : 0, // Evitar stock negativo
          });
        }
      }
    } catch (error) {
      console.error("Error updating producto stock:", error);
    }
  };