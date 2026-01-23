import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';
import { Cita } from './models/Cita.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/agenda').then(() => {
    console.log('Connected to MongoDB');
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
        const updated = await Cliente.findOneAndUpdate(
            { id: cliente.id },
            cliente,
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
        const updated = await Estilista.findOneAndUpdate(
            { id: estilista.id },
            estilista,
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
        const updated = await Servicio.findOneAndUpdate(
            { id: servicio.id },
            servicio,
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
        const updated = await Producto.findOneAndUpdate(
            { id: producto.id },
            producto,
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

ipcMain.handle('add-cita', async (_event, cita) => {
    try {
        const maxId = await Cita.findOne().sort('-id').lean();
        const newId = maxId ? maxId.id + 1 : 1;
        const newCita = new Cita({ ...cita, id: newId });
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

app.on("ready", ()=>{
    const preloadPath = path.join(__dirname, 'preload.js');
    // console.log('Preload path:', preloadPath);
    // console.log('__dirname:', __dirname);
    
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false, // Disable sandbox to allow preload script
        }
    });
    
    // Open DevTools for debugging
    // mainWindow.webContents.openDevTools();
    
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    
    // Check if preload script loaded
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Window loaded successfully');
    });
});