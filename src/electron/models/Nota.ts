import { Schema, model } from 'mongoose';

export interface INota {
  id: number;
  nota: string;
  estilistaId: number;
  estilistaNombre: string;
  estado: boolean;
  fecha: string; // DD-MM-YYYY format
}

const notaSchema = new Schema<INota>({
  id: { type: Number, required: true, unique: true },
  nota: { type: String, required: true },
  estilistaId: { type: Number, required: true },
  estilistaNombre: { type: String, required: true },
  estado: { type: Boolean, required: true, default: false },
  fecha: { type: String, required: true }, // DD-MM-YYYY
});

export const Nota = model<INota>('Nota', notaSchema);
