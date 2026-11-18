import { Cita } from "../types/Cita";

export const getCitaByFechaAndClienteId = async (fecha: string, clienteId: number) => {
    try {
        const citaData = await window.api.getCitaByFechaClienteId(
            fecha,
            clienteId,
        );
        return citaData || null;
    } catch (error) {
        console.log("Error al obtener cita por fecha y cliente", "error");
        return null;
    }
}

export const getCitasByFechaClienteId = async (fecha: string, clienteId: number) => {
    try {
        const citasData = await window.api.getCitasByFechaClienteId(fecha, clienteId);
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
