  export const searchClientesByNombre = async (nombre: string) => {
    try {
      const clientes = await window.api.getClientesByNombre(nombre);
      return clientes || null;
    } catch (error) {
      console.error("Error searching clientes by nombre:", error);
      return null;
    }
  };