import { Servicio } from "./Servicio";

// type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada";

export type Cita = {
    id: number;
    rowIndex: number;
    fecha: string;
    estilista: string;
    nombreCliente: string;
    telefonoCliente: string;
    servicio: Servicio;
    horaInicio: string;
    horaFin: string;
    duracion: number;
    estado: string;
    metodoDePago: string;
    notas: string;
};

// export default Cita;