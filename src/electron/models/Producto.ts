import { Schema, model } from 'mongoose';

export interface IProducto {
  id: number;
  nombre: string;
  marca: string;
  precio: string;
  descripcion?: string;
  stock?: number;
}

const productoSchema = new Schema<IProducto>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  precio: { type: String, required: true },
  descripcion: { type: String, required: false },
  stock: { type: Number, required: false },
});

export const Producto = model<IProducto>('Producto', productoSchema);
