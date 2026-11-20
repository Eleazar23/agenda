import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Producto } from './models/Producto.js';
import { Servicio } from './models/Servicio.js';

// Quita espacios en blanco al inicio/final del nombre de clientes, estilistas,
// productos y servicios, para que el ordenamiento alfabético quede correcto.
// Los esquemas ya tienen trim: true, así que esto solo corrige datos que
// quedaron guardados con espacios de antes de ese cambio.

export interface NombreCorregido {
  id: number;
  antes: string;
  despues: string;
}

export interface ResultadoNormalizacion {
  etiqueta: string;
  corregidos: NombreCorregido[];
}

type DocConNombre = { _id: mongoose.Types.ObjectId; id: number; [key: string]: unknown };

async function normalizarCampo(
  etiqueta: string,
  campo: string,
  documentos: DocConNombre[],
  apply: boolean,
  updateOne: (id: mongoose.Types.ObjectId, limpio: string) => Promise<unknown>,
): Promise<ResultadoNormalizacion> {
  const corregidos: NombreCorregido[] = [];

  for (const doc of documentos) {
    const valor = doc[campo];
    if (typeof valor !== 'string' || valor === valor.trim()) continue;

    const limpio = valor.trim();
    corregidos.push({ id: doc.id, antes: valor, despues: limpio });

    if (apply) {
      await updateOne(doc._id, limpio);
    }
  }

  return { etiqueta, corregidos };
}

export async function normalizarNombres(apply: boolean): Promise<ResultadoNormalizacion[]> {
  return [
    await normalizarCampo('Cliente', 'nombre', await Cliente.find().lean(), apply, (id, limpio) =>
      Cliente.updateOne({ _id: id }, { $set: { nombre: limpio } }),
    ),
    await normalizarCampo('Estilista', 'name', await Estilista.find().lean(), apply, (id, limpio) =>
      Estilista.updateOne({ _id: id }, { $set: { name: limpio } }),
    ),
    await normalizarCampo('Producto', 'nombre', await Producto.find().lean(), apply, (id, limpio) =>
      Producto.updateOne({ _id: id }, { $set: { nombre: limpio } }),
    ),
    await normalizarCampo('Servicio', 'nombre', await Servicio.find().lean(), apply, (id, limpio) =>
      Servicio.updateOne({ _id: id }, { $set: { nombre: limpio } }),
    ),
  ];
}
