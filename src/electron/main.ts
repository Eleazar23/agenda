import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';
import { Cita } from './models/Cita.js';
import { Gasto } from './models/Gasto.js';
import { Nota } from './models/Nota.js';
import { Feriado } from './models/Feriado.js';
import { Bloqueo } from './models/Bloqueo.js';
import { Counter } from './models/Counter.js';

// Prevent a second instance of the app from running
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
}

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';

// Connect to MongoDB using Mongoose
mongoose.connect(__dbUri).then(() => {
    console.log(`Connected to MongoDB (${__dbUri})`);
}).catch((err: unknown) => {
    console.error('Failed to connect to MongoDB', err);
});

// Quita los campos _id y __v que vienen de MongoDB antes de escribir de vuelta
const sinCamposMongo = (doc: Record<string, unknown>) => {
    const data = { ...doc };
    delete data._id;
    delete data.__v;
    return data;
};

interface MongoDuplicateKeyError extends Error {
    code?: number;
    keyPattern?: Record<string, number>;
}

// Siguiente id numérico para una entidad, usando un contador persistente
// (colección Counter) en vez de "max(id) + 1" sobre los documentos
// existentes. Esto evita que, tras borrar el documento con el id más alto,
// el siguiente alta reciclara ese mismo id — lo cual era un problema real
// para Producto/Servicio, cuyo id queda embebido en citas ya guardadas
// (p.ej. decrementProductoStock podía terminar descontando stock de un
// producto distinto que recicló el id del que se usó en esa cita).
async function getNextId(entityLabel: string, currentMaxId: number): Promise<number> {
    const existing = await Counter.findById(entityLabel);
    if (!existing) {
        // Primera vez que se usa el contador para esta entidad: se arranca
        // desde el id más alto ya existente en la colección, para no
        // retroceder ni chocar con datos creados antes de este cambio.
        try {
            await Counter.create({ _id: entityLabel, seq: currentMaxId });
        } catch {
            // Otro proceso ya lo creó entre el check y el create; no pasa
            // nada, el $inc de abajo sigue siendo atómico y correcto.
        }
    }
    const updated = await Counter.findOneAndUpdate(
        { _id: entityLabel },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
    );
    return updated!.seq;
}

async function addWithAutoId<T extends { id: number }>(
    Model: mongoose.Model<T>,
    data: Record<string, unknown>,
    entityLabel: string,
) {
    const maxDoc = await Model.findOne().sort('-id').lean();
    const newId = await getNextId(entityLabel, maxDoc ? maxDoc.id : 0);
    try {
        const doc = new Model({ ...data, id: newId });
        await doc.save();
        return doc.toObject();
    } catch (error) {
        const mongoError = error as MongoDuplicateKeyError;
        if (mongoError?.code === 11000) {
            const dupField = Object.keys(mongoError.keyPattern ?? {})[0] ?? 'campo';
            if (dupField === 'id') {
                // No debería ocurrir con el contador atómico; si pasa, es
                // un dato inconsistente (id insertado manualmente por
                // fuera de este flujo) y no tiene sentido reintentar solo.
                throw new Error(`No se pudo generar un id único para ${entityLabel}. Revisa los datos de esa colección.`);
            }
            throw new Error(`DUPLICATE_FIELD:${dupField}:Ya existe un ${entityLabel} con ese ${dupField}`);
        }
        throw error;
    }
}

// ========== Clientes IPC Handlers ==========
ipcMain.handle('get-clientes', async () => {
    try {
        return await Cliente.find().lean();
    } catch (error) {
        console.error('Error getting clientes:', error);
        throw error;
    }
});

ipcMain.handle('get-cliente', async (_event, nombre) => {
    try {
        return await Cliente.findOne({ nombre }).collation({ locale: 'en', strength: 2 }).lean();
    } catch (error) {
        console.error('Error getting cliente:', error);
        throw error;
    }
});

ipcMain.handle('get-clientes-by-nombre', async (_event, nombre) => {
    try {
        return await Cliente.find({ nombre }).collation({ locale: 'en', strength: 2 }).lean();
    } catch (error) {
        console.error('Error getting cliente:', error);
        throw error;
    }
});

ipcMain.handle('add-cliente', async (_event, cliente) => {
    try {
        return await addWithAutoId(Cliente, cliente, 'cliente');
    } catch (error) {
        console.error('Error adding cliente:', error);
        throw error;
    }
});

ipcMain.handle('update-cliente', async (_event, cliente) => {
    try {
        const clienteData = sinCamposMongo(cliente);
        const updated = await Cliente.findOneAndUpdate(
            { id: cliente.id },
            clienteData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating cliente:', error);
        throw error;
    }
});

ipcMain.handle('delete-cliente', async (_event, id) => {
    try {
        // Las citas guardan clienteId; borrar el cliente sin revisarlo las
        // deja huérfanas (apuntando a un cliente que ya no existe) en vez
        // de perder el historial, se bloquea el borrado y se avisa cuánto
        // historial tiene.
        const citasCount = await Cita.countDocuments({ clienteId: id });
        if (citasCount > 0) {
            throw new Error(`HAS_REFERENCES:cliente:${citasCount}`);
        }
        await Cliente.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting cliente:', error);
        throw error;
    }
});

// ========== Estilistas IPC Handlers ==========
ipcMain.handle('get-estilistas', async () => {
    try {
        return await Estilista.find().lean();
    } catch (error) {
        console.error('Error getting estilistas:', error);
        throw error;
    }
});

ipcMain.handle('add-estilista', async (_event, estilista) => {
    try {
        return await addWithAutoId(Estilista, estilista, 'estilista');
    } catch (error) {
        console.error('Error adding estilista:', error);
        throw error;
    }
});

ipcMain.handle('update-estilista', async (_event, estilista) => {
    try {
        const estilistaData = sinCamposMongo(estilista);
        const updated = await Estilista.findOneAndUpdate(
            { id: estilista.id },
            estilistaData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating estilista:', error);
        throw error;
    }
});

ipcMain.handle('delete-estilista', async (_event, id) => {
    try {
        // Las citas y notas guardan al estilista por nombre/estilistaId, no
        // por una referencia viva al documento; borrarlo sin revisarlo deja
        // ese historial apuntando a un estilista que ya no existe. Se
        // bloquea el borrado si hay citas o notas asociadas.
        const estilista = await Estilista.findOne({ id }).lean();
        if (estilista) {
            const [citasCount, notasCount] = await Promise.all([
                Cita.countDocuments({
                    $or: [
                        { 'servicios.estilista': estilista.name },
                        { 'productos.estilista': estilista.name },
                        { 'propinas.estilista': estilista.name },
                    ],
                }),
                Nota.countDocuments({ estilistaId: id }),
            ]);
            if (citasCount > 0 || notasCount > 0) {
                const partes: string[] = [];
                if (citasCount > 0) partes.push(`${citasCount} cita(s)`);
                if (notasCount > 0) partes.push(`${notasCount} nota(s)`);
                throw new Error(`HAS_REFERENCES:estilista:${partes.join(' y ')}`);
            }
        }
        await Estilista.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting estilista:', error);
        throw error;
    }
});

// ========== Servicios IPC Handlers ==========
ipcMain.handle('get-servicios', async () => {
    try {
        return await Servicio.find().lean();
    } catch (error) {
        console.error('Error getting servicios:', error);
        throw error;
    }
});

ipcMain.handle('add-servicio', async (_event, servicio) => {
    try {
        return await addWithAutoId(Servicio, servicio, 'servicio');
    } catch (error) {
        console.error('Error adding servicio:', error);
        throw error;
    }
});

ipcMain.handle('update-servicio', async (_event, servicio) => {
    try {
        const servicioData = sinCamposMongo(servicio);
        const updated = await Servicio.findOneAndUpdate(
            { id: servicio.id },
            servicioData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating servicio:', error);
        throw error;
    }
});

ipcMain.handle('delete-servicio', async (_event, id) => {
    try {
        await Servicio.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting servicio:', error);
        throw error;
    }
});

// ========== Productos IPC Handlers ==========
ipcMain.handle('get-productos', async () => {
    try {
        return await Producto.find().lean();
    } catch (error) {
        console.error('Error getting productos:', error);
        throw error;
    }
});

ipcMain.handle('get-producto-by-id', async (_event, id) => {
    try {
        return await Producto.findOne({ id }).lean();
    } catch (error) {
        console.error('Error getting producto by ID:', error);
        throw error;
    }
});

ipcMain.handle('add-producto', async (_event, producto) => {
    try {
        return await addWithAutoId(Producto, producto, 'producto');
    } catch (error) {
        console.error('Error adding producto:', error);
        throw error;
    }
});

ipcMain.handle('update-producto', async (_event, producto) => {
    try {
        const productoData = sinCamposMongo(producto);
        const updated = await Producto.findOneAndUpdate(
            { id: producto.id },
            productoData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating producto:', error);
        throw error;
    }
});

ipcMain.handle('delete-producto', async (_event, id) => {
    try {
        await Producto.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting producto:', error);
        throw error;
    }
});

ipcMain.handle('decrement-producto-stock', async (_event, id, cantidad) => {
    try {
        const updated = await Producto.findOneAndUpdate(
            { id, stock: { $gte: cantidad } },
            { $inc: { stock: -cantidad } },
            { new: true, runValidators: true }
        ).lean();
        if (!updated) {
            return await Producto.findOneAndUpdate(
                { id },
                { $set: { stock: 0 } },
                { new: true, runValidators: true }
            ).lean();
        }
        return updated;
    } catch (error) {
        console.error('Error decrementing producto stock:', error);
        throw error;
    }
});

// ========== Citas IPC Handlers ==========
ipcMain.handle('get-citas', async () => {
    try {
        return await Cita.find().lean();
    } catch (error) {
        console.error('Error getting citas:', error);
        throw error;
    }
});

// Se excluyen las citas con estado "cancelado": estas tres consultas
// alimentan la agenda (qué se dibuja en la cuadrícula) y la detección de
// solapes/disponibilidad al agendar o editar, así que una cita cancelada no
// debe seguir ocupando su celda ni bloquear que se reagende ese horario. El
// registro cancelado se conserva en la colección (con otro id) para el
// historial del cliente, que sí lo lee sin este filtro (get-citas-by-cliente).
ipcMain.handle('get-citas-by-fecha', async (_event, fecha) => {
    try {
        return await Cita.find({ fecha, estado: { $ne: 'cancelado' } }).lean();
    } catch (error) {
        console.error('Error getting citas by fecha:', error);
        throw error;
    }
});

// Reportes por rango (día/semana/mes). Las fechas se guardan como string
// DD-MM-YYYY, que no ordena cronológicamente, así que el UI manda la lista
// explícita de días del rango y aquí se consulta con $in.
ipcMain.handle('get-citas-by-fechas', async (_event, fechas: string[]) => {
    try {
        if (!Array.isArray(fechas) || fechas.length === 0) return [];
        return await Cita.find({ fecha: { $in: fechas }, estado: { $ne: 'cancelado' } }).lean();
    } catch (error) {
        console.error('Error getting citas by fechas:', error);
        throw error;
    }
});

ipcMain.handle('get-citas-by-fecha-clienteid', async (_event, fecha, clienteId) => {
    try {
        return await Cita.find({ fecha, clienteId, estado: { $ne: 'cancelado' } }).lean();
    } catch (error) {
        console.error('Error getting citas by fecha and clienteId:', error);
        throw error;
    }
});

ipcMain.handle('get-cita-by-fecha-clienteid', async (_event, fecha, clienteId) => {
    try {
        return await Cita.findOne({ fecha, clienteId, estado: { $ne: 'cancelado' } }).lean();
    } catch (error) {
        console.error('Error getting cita by fecha and clienteId:', error);
        throw error;
    }
});

ipcMain.handle('get-cita-by-id', async (_event, id) => {
    try {
        return await Cita.findOne({ id }).lean();
    } catch (error) {
        console.error('Error getting cita by id:', error);
        throw error;
    }
});

ipcMain.handle('get-citas-by-cliente', async (_event, clienteId, nombreCliente, telefonoCliente) => {
    try {
        // Se busca por clienteId (estable, no cambia) y también por
        // nombre+teléfono (por si la cita es de antes de que ese campo
        // existiera, ver migrateClienteId.ts). Buscar solo por nombre+
        // teléfono rompía el historial en cuanto se corregía una errata en
        // el nombre o el teléfono del cliente: esas citas pasadas dejaban
        // de encontrarse porque ya no coincidían con el dato editado.
        return await Cita.find({
            $or: [
                { clienteId },
                { nombreCliente, telefonoCliente },
            ],
        }).lean();
    } catch (error) {
        console.error('Error getting citas by cliente:', error);
        throw error;
    }
});

ipcMain.handle('add-cita', async (_event, cita) => {
    try {
        // const maxId = await Cita.findOne().sort('-id').lean();
        // const newId = maxId ? maxId.id + 1 : 1;
        // const newCita = new Cita({ ...cita, id: newId });
        // La UI recrea citas a partir de documentos leídos de la BD (al
        // cancelar o mover de fecha); sin quitar _id el insert choca con el
        // original, que todavía existe en ese momento.
        const newCita = new Cita(sinCamposMongo(cita));
        await newCita.save();
        return newCita.toObject();
    } catch (error) {
        console.error('Error adding cita:', error);
        throw error;
    }
});

ipcMain.handle('update-cita', async (_event, cita) => {
    try {
        const citaData = sinCamposMongo(cita);
        const updated = await Cita.findOneAndUpdate(
            { id: cita.id },
            citaData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating cita:', error);
        throw error;
    }
});

ipcMain.handle('delete-cita', async (_event, id) => {
    try {
        await Cita.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting cita:', error);
        throw error;
    }
});

// ========== Gastos IPC Handlers ==========
ipcMain.handle('get-gastos', async () => {
    try {
        return await Gasto.find().lean();
    } catch (error) {
        console.error('Error getting gastos:', error);
        throw error;
    }
});

ipcMain.handle('get-gastos-by-fecha', async (_event, fecha) => {
    try {
        // Simple date comparison assuming DD-MM-YYYY format
        return await Gasto.find({ fecha }).lean();
    } catch (error) {
        console.error('Error getting gastos by fecha:', error);
        throw error;
    }
});

ipcMain.handle('get-gastos-by-fechas', async (_event, fechas: string[]) => {
    try {
        if (!Array.isArray(fechas) || fechas.length === 0) return [];
        return await Gasto.find({ fecha: { $in: fechas } }).lean();
    } catch (error) {
        console.error('Error getting gastos by fechas:', error);
        throw error;
    }
});

ipcMain.handle('get-gastos-by-categoria', async (_event, categoria) => {
    try {
        return await Gasto.find({ categoria }).lean();
    } catch (error) {
        console.error('Error getting gastos by categoria:', error);
        throw error;
    }
});

ipcMain.handle('add-gasto', async (_event, gasto) => {
    try {
        return await addWithAutoId(Gasto, gasto, 'gasto');
    } catch (error) {
        console.error('Error adding gasto:', error);
        throw error;
    }
});

ipcMain.handle('update-gasto', async (_event, gasto) => {
    try {
        const gastoData = sinCamposMongo(gasto);
        const updated = await Gasto.findOneAndUpdate(
            { id: gasto.id },
            gastoData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating gasto:', error);
        throw error;
    }
});

ipcMain.handle('delete-gasto', async (_event, id) => {
    try {
        await Gasto.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting gasto:', error);
        throw error;
    }
});

ipcMain.handle('get-gastos-totals', async () => {
    try {
        const totals = await Gasto.aggregate([
            {
                $group: {
                    _id: '$categoria',
                    total: { $sum: '$monto' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return totals;
    } catch (error) {
        console.error('Error getting gastos totals:', error);
        throw error;
    }
});

// ========== Notas IPC Handlers ==========
ipcMain.handle('get-notas', async () => {
    try {
        return await Nota.find().lean();
    } catch (error) {
        console.error('Error getting notas:', error);
        throw error;
    }
});

ipcMain.handle('get-notas-by-estilista', async (_event, estilistaId) => {
    try {
        return await Nota.find({ estilistaId }).lean();
    } catch (error) {
        console.error('Error getting notas by estilista:', error);
        throw error;
    }
});

ipcMain.handle('get-notas-by-fecha', async (_event, fecha) => {
    try {
        return await Nota.find({ fecha }).lean();
    } catch (error) {
        console.error('Error getting notas by fecha:', error);
        throw error;
    }
});

ipcMain.handle('add-nota', async (_event, nota) => {
    try {
        return await addWithAutoId(Nota, nota, 'nota');
    } catch (error) {
        console.error('Error adding nota:', error);
        throw error;
    }
});

ipcMain.handle('update-nota', async (_event, nota) => {
    try {
        const notaData = sinCamposMongo(nota);
        const updated = await Nota.findOneAndUpdate(
            { id: nota.id },
            notaData,
            { new: true, runValidators: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating nota:', error);
        throw error;
    }
});

ipcMain.handle('delete-nota', async (_event, id) => {
    try {
        await Nota.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting nota:', error);
        throw error;
    }
});

// ========== Feriados IPC Handlers ==========
ipcMain.handle('get-feriados-by-anio', async (_event, anio) => {
    try {
        return await Feriado.find({ fecha: { $regex: `-${anio}$` } }).lean();
    } catch (error) {
        console.error('Error getting feriados by anio:', error);
        throw error;
    }
});

ipcMain.handle('add-feriado', async (_event, feriado) => {
    try {
        return await addWithAutoId(Feriado, feriado, 'feriado');
    } catch (error) {
        console.error('Error adding feriado:', error);
        throw error;
    }
});

ipcMain.handle('delete-feriado', async (_event, id) => {
    try {
        await Feriado.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting feriado:', error);
        throw error;
    }
});

// ========== Bloqueos IPC Handlers ==========
ipcMain.handle('get-bloqueos-by-fecha', async (_event, fecha) => {
    try {
        return await Bloqueo.find({ fecha }).lean();
    } catch (error) {
        console.error('Error getting bloqueos by fecha:', error);
        throw error;
    }
});

// "HH:mm" -> minutos desde medianoche, para comparar horarios de bloqueo.
const minutosDesdeHora = (hora: string): number => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

ipcMain.handle('add-bloqueo', async (_event, bloqueo) => {
    try {
        const inicio = minutosDesdeHora(bloqueo.horaInicio);
        const fin = minutosDesdeHora(bloqueo.horaFin);
        if (!(fin > inicio)) {
            throw new Error('INVALID_RANGE:La hora de fin debe ser posterior a la hora de inicio');
        }

        // Nada en la UI impedía (a nivel de servidor) crear dos bloqueos del
        // mismo estilista/fecha que se traslapen entre sí; el formulario solo
        // restringe las opciones del selector, pero cualquier otra llamada a
        // este handler podía saltárselo.
        const bloqueosDelDia = await Bloqueo.find({
            estilista: bloqueo.estilista,
            fecha: bloqueo.fecha,
        }).lean();
        const seTraslapa = bloqueosDelDia.some((b) => {
            const bInicio = minutosDesdeHora(b.horaInicio);
            const bFin = minutosDesdeHora(b.horaFin);
            return inicio < bFin && bInicio < fin;
        });
        if (seTraslapa) {
            throw new Error('OVERLAP:Ya existe un descanso para ese estilista que se traslapa con ese horario');
        }

        return await addWithAutoId(Bloqueo, bloqueo, 'bloqueo');
    } catch (error) {
        console.error('Error adding bloqueo:', error);
        throw error;
    }
});

ipcMain.handle('delete-bloqueo', async (_event, id) => {
    try {
        await Bloqueo.deleteOne({ id });
    } catch (error) {
        console.error('Error deleting bloqueo:', error);
        throw error;
    }
});

// ========== Migración: rellenar clienteId en citas antiguas ==========
// Busca el Cliente correspondiente por nombre + teléfono para citas guardadas
// antes de que existiera el campo clienteId. Se dispara desde el menú
// Herramientas (Alt para revelar la barra de menú) para poder correrla
// en producción sin necesitar Node.js ni el proyecto de desarrollo.
async function runMigrateClienteId(apply: boolean): Promise<string> {
    const citasSinClienteId = await Cita.find({
        $or: [{ clienteId: { $exists: false } }, { clienteId: null }],
    }).lean();

    if (citasSinClienteId.length === 0) {
        return 'No hay citas sin clienteId. Nada que migrar.';
    }

    const lines: string[] = [`Encontradas ${citasSinClienteId.length} citas sin clienteId.`, ''];
    let matched = 0;
    let unmatched = 0;

    for (const cita of citasSinClienteId) {
        const cliente = await Cliente.findOne({
            nombre: cita.nombreCliente,
            telefono: cita.telefonoCliente,
        })
            .collation({ locale: 'en', strength: 2 })
            .lean();

        if (!cliente) {
            unmatched++;
            lines.push(`[SIN MATCH] cita id="${cita.id}" fecha=${cita.fecha} nombreCliente="${cita.nombreCliente}" telefonoCliente="${cita.telefonoCliente}"`);
            continue;
        }

        matched++;
        lines.push(`[OK] cita id="${cita.id}" -> clienteId=${cliente.id} (${cliente.nombre})`);

        if (apply) {
            await Cita.updateOne({ id: cita.id }, { $set: { clienteId: cliente.id } });
        }
    }

    lines.push('', `Resumen: ${matched} citas ${apply ? 'actualizadas' : 'se actualizarían'}, ${unmatched} sin match.`);
    if (!apply && matched > 0) {
        lines.push('Corre "Migrar ClienteId (aplicar cambios)" para aplicar estos cambios.');
    }

    return lines.join('\n');
}

// ========== Migración: sincronizar id (fecha-clienteId) de citas ==========
// El id de una cita es una clave compuesta fecha-clienteId asignada al
// crearla. Si se le cambió la fecha antes de que existiera la corrección
// que mantiene el id sincronizado (ver handleEditCita en AgendaContext.tsx),
// el id se queda desactualizado y puede chocar (E11000) con el id que le
// tocaría a una cita nueva agendada en esa fecha para el mismo cliente. Se
// dispara desde el menú Herramientas para poder correrla en producción sin
// necesitar Node.js ni el proyecto de desarrollo.
const ID_COMPUESTO_CITA_REGEX = /^\d{2}-\d{2}-\d{4}-\d+$/;

async function runMigrateCitaIds(apply: boolean): Promise<string> {
    const citas = await Cita.find().lean();
    // Snapshot mutable de qué cita ocupa cada id, para detectar colisiones
    // reales incluso cuando una corrección de esta misma corrida libera un
    // id que otra cita desincronizada necesita.
    const porId = new Map(citas.map((c) => [c.id, c]));

    // Solo interesan los ids que la propia app genera (DD-MM-YYYY-clienteId).
    // Otros esquemas de id (datos de seed/demo como "cita-1") nunca
    // siguieron esta convención y no son corrupción: no deben tocarse.
    const desincronizadas = citas.filter(
        (c) => ID_COMPUESTO_CITA_REGEX.test(c.id) && c.id !== `${c.fecha}-${c.clienteId}`,
    );

    if (desincronizadas.length === 0) {
        return 'No hay citas con id desincronizado de su fecha. Nada que migrar.';
    }

    const lines: string[] = [`Encontradas ${desincronizadas.length} citas con id desincronizado.`, ''];
    let corregidas = 0;
    let enColision = 0;

    for (const cita of desincronizadas) {
        const idCorrecto = `${cita.fecha}-${cita.clienteId}`;
        const colision = porId.get(idCorrecto);

        if (colision) {
            enColision++;
            lines.push(
                `[COLISIÓN] cita id="${cita.id}" (nombreCliente="${cita.nombreCliente}", fecha=${cita.fecha}) debería tener id="${idCorrecto}", pero ese id ya lo usa otra cita (nombreCliente="${colision.nombreCliente}", fecha=${colision.fecha}). Ábrela desde la agenda y vuelve a guardarla en su fecha correcta para que se fusionen de forma segura (valida solapes de horario/estilista).`,
            );
            continue;
        }

        corregidas++;
        lines.push(`[OK] cita id="${cita.id}" -> id="${idCorrecto}"`);

        if (apply) {
            await Cita.updateOne({ id: cita.id }, { $set: { id: idCorrecto } });
        }
        porId.delete(cita.id);
        porId.set(idCorrecto, { ...cita, id: idCorrecto });
    }

    lines.push('', `Resumen: ${corregidas} citas ${apply ? 'corregidas' : 'se corregirían'}, ${enColision} en colisión (requieren revisión manual desde la agenda).`);
    if (!apply && corregidas > 0) {
        lines.push('Corre "Migrar Ids de Citas (aplicar cambios)" para aplicar estos cambios.');
    }

    return lines.join('\n');
}

function buildAppMenu(mainWindow: BrowserWindow) {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Herramientas',
            submenu: [
                {
                    label: 'Migrar ClienteId (simulación)',
                    click: async () => {
                        try {
                            const report = await runMigrateClienteId(false);
                            dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'Migrar ClienteId - Simulación',
                                message: report,
                            });
                        } catch (error) {
                            dialog.showErrorBox('Error migrando clienteId', error instanceof Error ? error.message : String(error));
                        }
                    },
                },
                {
                    label: 'Migrar ClienteId (aplicar cambios)',
                    click: async () => {
                        const confirmResult = await dialog.showMessageBox(mainWindow, {
                            type: 'warning',
                            buttons: ['Cancelar', 'Aplicar cambios'],
                            defaultId: 0,
                            cancelId: 0,
                            title: 'Confirmar migración',
                            message: 'Esto escribirá el campo clienteId en las citas encontradas. ¿Continuar?',
                        });
                        if (confirmResult.response !== 1) return;

                        try {
                            const report = await runMigrateClienteId(true);
                            dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'Migrar ClienteId - Cambios aplicados',
                                message: report,
                            });
                        } catch (error) {
                            dialog.showErrorBox('Error migrando clienteId', error instanceof Error ? error.message : String(error));
                        }
                    },
                },
                { type: 'separator' },
                {
                    label: 'Migrar Ids de Citas (simulación)',
                    click: async () => {
                        try {
                            const report = await runMigrateCitaIds(false);
                            dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'Migrar Ids de Citas - Simulación',
                                message: report,
                            });
                        } catch (error) {
                            dialog.showErrorBox('Error migrando ids de citas', error instanceof Error ? error.message : String(error));
                        }
                    },
                },
                {
                    label: 'Migrar Ids de Citas (aplicar cambios)',
                    click: async () => {
                        const confirmResult = await dialog.showMessageBox(mainWindow, {
                            type: 'warning',
                            buttons: ['Cancelar', 'Aplicar cambios'],
                            defaultId: 0,
                            cancelId: 0,
                            title: 'Confirmar migración',
                            message: 'Esto corregirá el campo id en las citas encontradas. ¿Continuar?',
                        });
                        if (confirmResult.response !== 1) return;

                        try {
                            const report = await runMigrateCitaIds(true);
                            dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'Migrar Ids de Citas - Cambios aplicados',
                                message: report,
                            });
                        } catch (error) {
                            dialog.showErrorBox('Error migrando ids de citas', error instanceof Error ? error.message : String(error));
                        }
                    },
                },
            ],
        },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

let mainWindow: BrowserWindow | null = null;

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.on("ready", ()=>{
    const preloadPath = path.join(__dirname, 'preload.js');
    // console.log('Preload path:', preloadPath);
    // console.log('__dirname:', __dirname);

    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false // Disable sandbox to allow preload script
        }
    });

    buildAppMenu(mainWindow);

    mainWindow.webContents.on('before-input-event', (_event, input) => {
        if (input.control && input.shift && input.key.toLowerCase() === 'i') {
            mainWindow?.webContents.toggleDevTools();
        }
    });

    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));

    // Check if preload script loaded
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Window loaded successfully');
    });
});