import { Schema, model } from 'mongoose';

export interface IEstilista {
  id: number;
  name: string;
  phone: string;
  displayName?: string;
}

const estilistaSchema = new Schema<IEstilista>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  displayName: { type: String, required: false },
});

export const Estilista = model<IEstilista>('Estilista', estilistaSchema);
