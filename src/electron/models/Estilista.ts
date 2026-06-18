import { Schema, model } from 'mongoose';

export interface IEstilista {
  id: number;
  name: string;
  telefono: string;
  displayName?: string;
  role: string;
}

const estilistaSchema = new Schema<IEstilista>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  telefono: { type: String, required: true },
  displayName: { type: String, required: false },
  role: { type: String, required: true, default: 'estilista' },
});

export const Estilista = model<IEstilista>('Estilista', estilistaSchema);
