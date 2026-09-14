import { ProductoInCita } from "./Producto";
// import { Servicio } from "./Servicio";
import { ServicioAgendado } from "./ServicioAgendado";

// type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada";

export type Cita = {
    id: string;
    clienteId: number;
    fecha: string;
    nombreCliente: string;
    telefonoCliente: string;
    servicios: ServicioAgendado[] | [];
    productos: ProductoInCita[] | [];
    estado: string;
    metodoDePago: string;
    notas: string;
    // Fecha y hora reales en las que se creó la cita (referencia; no
    // cambian si luego se edita/mueve la cita a otra fecha).
    fechaCreacion?: string;
    horaCreacion?: string;
};

// export default Cita;