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
}).catch((err: any) => {
    console.error('Failed to connect to MongoDB', err);
});

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
        const maxId = await Cliente.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newCliente = new Cliente({ ...cliente, id: newId });
        await newCliente.save();
        return newCliente.toObject();
    } catch (error) {
        console.error('Error adding cliente:', error);
        throw error;
    }
});

ipcMain.handle('update-cliente', async (_event, cliente) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...clienteData } = cliente as any;
        const updated = await Cliente.findOneAndUpdate(
            { id: cliente.id },
            clienteData,
            { new: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating cliente:', error);
        throw error;
    }
});

ipcMain.handle('delete-cliente', async (_event, id) => {
    try {
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
        const maxId = await Estilista.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newEstilista = new Estilista({ ...estilista, id: newId });
        await newEstilista.save();
        return newEstilista.toObject();
    } catch (error) {
        console.error('Error adding estilista:', error);
        throw error;
    }
});

ipcMain.handle('update-estilista', async (_event, estilista) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...estilistaData } = estilista as any;
        const updated = await Estilista.findOneAndUpdate(
            { id: estilista.id },
            estilistaData,
            { new: true }
        ).lean();
        return updated;
    } catch (error) {
        console.error('Error updating estilista:', error);
        throw error;
    }
});

ipcMain.handle('delete-estilista', async (_event, id) => {
    try {
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
        const maxId = await Servicio.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newServicio = new Servicio({ ...servicio, id: newId });
        await newServicio.save();
        return newServicio.toObject();
    } catch (error) {
        console.error('Error adding servicio:', error);
        throw error;
    }
});

ipcMain.handle('update-servicio', async (_event, servicio) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...servicioData } = servicio as any;
        const updated = await Servicio.findOneAndUpdate(
            { id: servicio.id },
            servicioData,
            { new: true }
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
        const maxId = await Producto.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newProducto = new Producto({ ...producto, id: newId });
        await newProducto.save();
        return newProducto.toObject();
    } catch (error) {
        console.error('Error adding producto:', error);
        throw error;
    }
});

ipcMain.handle('update-producto', async (_event, producto) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...productoData } = producto as any;
        const updated = await Producto.findOneAndUpdate(
            { id: producto.id },
            productoData,
            { new: true }
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

// ========== Citas IPC Handlers ==========
ipcMain.handle('get-citas', async () => {
    try {
        return await Cita.find().lean();
    } catch (error) {
        console.error('Error getting citas:', error);
        throw error;
    }
});

ipcMain.handle('get-citas-by-fecha', async (_event, fecha) => {
    try {
        return await Cita.find({ fecha }).lean();
    } catch (error) {
        console.error('Error getting citas by fecha:', error);
        throw error;
    }
});

ipcMain.handle('get-citas-by-fecha-clienteid', async (_event, fecha, clienteId) => {
    try {
        return await Cita.find({ fecha, clienteId }).lean();
    } catch (error) {
        console.error('Error getting citas by fecha and clienteId:', error);
        throw error;
    }
});

ipcMain.handle('get-cita-by-fecha-clienteid', async (_event, fecha, clienteId) => {
    try {
        return await Cita.findOne({ fecha, clienteId }).lean();
    } catch (error) {
        console.error('Error getting cita by fecha and clienteId:', error);
        throw error;
    }
});

ipcMain.handle('get-citas-by-cliente', async (_event, nombreCliente, telefonoCliente) => {
    try {
        return await Cita.find({ nombreCliente, telefonoCliente }).lean();
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
        const newCita = new Cita({ ...cita });
        await newCita.save();
        return newCita.toObject();
    } catch (error) {
        console.error('Error adding cita:', error);
        throw error;
    }
});

ipcMain.handle('update-cita', async (_event, cita) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...citaData } = cita as any;
        const updated = await Cita.findOneAndUpdate(
            { id: cita.id },
            citaData,
            { new: true }
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
        const maxId = await Gasto.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newGasto = new Gasto({ ...gasto, id: newId });
        await newGasto.save();
        return newGasto.toObject();
    } catch (error) {
        console.error('Error adding gasto:', error);
        throw error;
    }
});

ipcMain.handle('update-gasto', async (_event, gasto) => {
    try {
        // Remove _id and __v fields that might come from MongoDB
        const { _id, __v, ...gastoData } = gasto as any;
        const updated = await Gasto.findOneAndUpdate(
            { id: gasto.id },
            gastoData,
            { new: true }
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
        const maxId = await Nota.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newNota = new Nota({ ...nota, id: newId });
        await newNota.save();
        return newNota.toObject();
    } catch (error) {
        console.error('Error adding nota:', error);
        throw error;
    }
});

ipcMain.handle('update-nota', async (_event, nota) => {
    try {
        const { _id, __v, ...notaData } = nota as any;
        const updated = await Nota.findOneAndUpdate(
            { id: nota.id },
            notaData,
            { new: true }
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
                        } catch (error: any) {
                            dialog.showErrorBox('Error migrando clienteId', String(error?.message ?? error));
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
                        } catch (error: any) {
                            dialog.showErrorBox('Error migrando clienteId', String(error?.message ?? error));
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

    // Open DevTools for debugging
    // mainWindow.webContents.openDevTools();

    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));

    // Check if preload script loaded
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Window loaded successfully');
    });
});