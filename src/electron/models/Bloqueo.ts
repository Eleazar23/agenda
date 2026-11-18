import { Schema, model } from 'mongoose';

export interface IBloqueo {
  id: number;
  estilista: string;
  fecha: string; // DD-MM-YYYY
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  motivo: string;
}

const bloqueoSchema = new Schema<IBloqueo>({
  id: { type: Number, required: true, unique: true },
  estilista: { type: String, required: true },
  fecha: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  motivo: { type: String, required: true, default: 'Comida' },
});

export const Bloqueo = model<IBloqueo>('Bloqueo', bloqueoSchema);
