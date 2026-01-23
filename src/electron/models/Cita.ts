import { Schema, model } from 'mongoose';

export interface IServicioInCita {
  id: number;
  nombre: string;
  precio: string;
}

export interface ICita {
  id: number;
  rowIndex: number;
  fecha: string;
  estilista: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicio: IServicioInCita;
  horaInicio: string;
  horaFin: string;
  duracion: number;
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
  id: { type: Number, required: true, unique: true },
  rowIndex: { type: Number, required: true },
  fecha: { type: String, required: true },
  estilista: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  telefonoCliente: { type: String, required: true },
  servicio: { type: servicioInCitaSchema, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  duracion: { type: Number, required: true },
  estado: { type: String, required: true },
  metodoDePago: { type: String},
  notas: { type: String},
});

export const Cita = model<ICita>('Cita', citaSchema);
