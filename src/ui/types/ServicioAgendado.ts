import { Servicio } from "./Servicio";

// export type ServicioAgendado = {
//     id: number;
//     rowIndex: number;
//     cellID: string;
//     servicio: Servicio;
//     estilista: string;
//     horaInicio: string;
//     horaFin: string;
//     duracion: number;
//     productos: Producto[] | [];
//     fecha: string;
// }

export type ServicioAgendado = {
    rowIndex: number;
    cellID: string;
    servicio: Servicio;
    estilista: string;
    horaInicio: string;
    horaFin: string;
    duracion: number;
    fecha: string;
    // Fecha y hora reales en las que se agendó este servicio (referencia;
    // no cambian si luego se edita/mueve la cita a otra fecha).
    fechaCreacion?: string;
    horaCreacion?: string;
};