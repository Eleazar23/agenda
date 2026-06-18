import { Cita } from "../types/Cita";

export const getCitaByFechaAndCliente = async (fecha: string, nombreCliente: string) => {
    try {
        const citaData = await window.api.getCitaByFechaCliente(
            fecha,
            nombreCliente,
        );
        return citaData || null;
    } catch (error) {
        console.log("Error al obtener cita por fecha y cliente", "error");
        return null;
    }
}

export const getCitasByFechaCliente = async (fecha: string, nombreCliente: string) => {
    try {
        const citasData = await window.api.getCitasByFechaCliente(fecha, nombreCliente);
        return citasData || [];
    } catch (error) {
        console.log("Error al obtener citas por fecha y cliente", "error");
        return [];
    }
}

export const updateCita = async (updatedData: Cita) => {
    try {
        const updatedCita = await window.api.updateCita( updatedData);
        return updatedCita;
    } catch (error) {
        console.log("Error al actualizar cita", "error");
        return null;
    }
}