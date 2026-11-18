import { Schema, model } from 'mongoose';

export interface IVacacion {
  inicio: string; // DD-MM-YYYY
  fin: string; // DD-MM-YYYY
}

export interface IEstilista {
  id: number;
  name: string;
  telefono: string;
  displayName?: string;
  role: string;
  vacaciones?: IVacacion[];
}

const vacacionSchema = new Schema<IVacacion>(
  {
    inicio: { type: String, required: true },
    fin: { type: String, required: true },
  },
  { _id: false },
);

const estilistaSchema = new Schema<IEstilista>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  telefono: { type: String, required: true },
  displayName: { type: String, required: false },
  role: { type: String, required: true, default: 'estilista' },
  vacaciones: { type: [vacacionSchema], required: false, default: [] },
});

export const Estilista = model<IEstilista>('Estilista', estilistaSchema);
