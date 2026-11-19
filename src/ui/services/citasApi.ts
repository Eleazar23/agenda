export const getCitasByFechaClienteId = async (fecha: string, clienteId: number) => {
    try {
        const citasData = await window.api.getCitasByFechaClienteId(fecha, clienteId);
        return citasData || [];
    } catch (error) {
        console.error("Error al obtener citas por fecha y cliente", error);
        return [];
    }
}
