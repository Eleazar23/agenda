import { Schema, model } from 'mongoose';

// Lleva el último id numérico emitido para cada entidad (Cliente, Servicio,
// Producto, etc.). A diferencia de calcular "max(id) + 1" sobre los
// documentos existentes, este contador nunca retrocede: si se borra el
// documento con el id más alto, el siguiente id emitido sigue siendo mayor
// a cualquiera ya usado, en vez de reciclar uno que pudo haber quedado
// embebido/referenciado en otra colección (p.ej. un producto dentro de una
// cita ya guardada).
export interface ICounter {
  _id: string; // nombre de la entidad, p.ej. "producto"
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
});

export const Counter = model<ICounter>('Counter', counterSchema);
