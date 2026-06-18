import { Schema, model } from 'mongoose';

export interface IGasto {
  id: number;
  proveedorNombre: string;
  monto: number;
  fecha: string; // DD-MM-YYYY format
  categoria: string;
  descripcion: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

const gastoSchema = new Schema<IGasto>({
  id: { type: Number, required: true, unique: true },
  proveedorNombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: String, required: true }, // DD-MM-YYYY
  categoria: { type: String, required: true },
  descripcion: { type: String, required: false },
  metodoPago: { type: String, enum: ['efectivo', 'tarjeta', 'transferencia'], required: true },
});

export const Gasto = model<IGasto>('Gasto', gastoSchema);
