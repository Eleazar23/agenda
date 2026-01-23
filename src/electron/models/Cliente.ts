import { Schema, model } from 'mongoose';

export interface ICliente {
  id: number;
  nombre: string;
  phone: string;
  correo: string;
  lastVisit: string;
}

const clienteSchema = new Schema<ICliente>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  phone: { type: String, required: true },
  correo: { type: String},
  lastVisit: { type: String},
});

export const Cliente = model<ICliente>('Cliente', clienteSchema);
