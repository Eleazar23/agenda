import { Schema, model } from 'mongoose';

export interface IServicioInCita {
  id: number;
  nombre: string;
  precio: string;
}

export interface IProductoInCita {
  id: number;
  nombre: string;
  estilista: string;
  precio: string;
  cantidad: number;
}

export interface IServicioAgendadoInCita {
  rowIndex: number;
  cellID: string;
  servicio: IServicioInCita;
  estilista: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  fecha: string;
}

export interface ICita {
  id: string;
  fecha: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicios: IServicioAgendadoInCita[] | [];
  productos: IProductoInCita[] | [];
  estado: string;
  metodoDePago: string;
  notas: string;
}

const servicioInCitaSchema = new Schema<IServicioInCita>({
  id: { type: Number, required: true },
  nombre: { type: String, required: true },
  precio: { type: String, required: true },
}, { _id: false });

const citaSchema = new Schema<ICita>({
  id: { type: String, required: true, unique: true },
  fecha: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  telefonoCliente: { type: String, required: true },
  servicios: { type: [Object], default: [] },
  productos: { type: [Object], default: [] },
  estado: { type: String, required: true },
  metodoDePago: { type: String},
  notas: { type: String},
});

export const Cita = model<ICita>('Cita', citaSchema);
