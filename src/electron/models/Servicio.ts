import { Schema, model } from 'mongoose';

export interface IServicio {
  id: number;
  nombre: string;
  precio: string;
}

const servicioSchema = new Schema<IServicio>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  precio: { type: String, required: true },
});

export const Servicio = model<IServicio>('Servicio', servicioSchema);
