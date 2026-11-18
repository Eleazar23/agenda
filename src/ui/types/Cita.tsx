import { ProductoInCita } from "./Producto";
// import { Servicio } from "./Servicio";
import { ServicioAgendado } from "./ServicioAgendado";

// Propina que el cliente deja a una estilista. Una cita puede tener varias
// (una por estilista) cuando la propina se reparte.
export type Propina = {
    estilista: string;
    monto: number;
    metodoDePago: string;
};

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
    propinas?: Propina[];
    // Fecha y hora reales en las que se creó la cita (referencia; no
    // cambian si luego se edita/mueve la cita a otra fecha).
    fechaCreacion?: string;
    horaCreacion?: string;
};

// export default Cita;