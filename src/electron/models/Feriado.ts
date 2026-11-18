import { Schema, model } from 'mongoose';

export interface IFeriado {
  id: number;
  fecha: string; // DD-MM-YYYY
  nombre: string;
}

const feriadoSchema = new Schema<IFeriado>({
  id: { type: Number, required: true, unique: true },
  fecha: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
});

export const Feriado = model<IFeriado>('Feriado', feriadoSchema);
