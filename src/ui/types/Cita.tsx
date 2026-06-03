import { ProductoInCita } from "./Producto";
// import { Servicio } from "./Servicio";
import { ServicioAgendado } from "./ServicioAgendado";

// type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada";

export type Cita = {
    id: string;
    fecha: string;
    nombreCliente: string;
    telefonoCliente: string;
    servicios: ServicioAgendado[] | [];
    productos: ProductoInCita[] | [];
    estado: string;
    metodoDePago: string;
    notas: string;
};

// export default Cita;