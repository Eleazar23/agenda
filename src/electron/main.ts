import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import '../database';
import Appointment from '../models/Appointment'; // new model import
import { contextBridge, ipcRenderer } from 'electron';

app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({});
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // ensure preload is compiled to dist-electron
    },
  });

  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));

  // IPC handlers for basic CRUD
  ipcMain.handle('db:createAppointment', async (event, payload) => {
    return Appointment.create(payload);
  });

  ipcMain.handle('db:getAppointments', async () => {
    return Appointment.find().lean();
  });

  ipcMain.handle('db:deleteAppointment', async (event, id: string) => {
    return Appointment.findByIdAndDelete(id);
  });

  // add more handlers as needed
});

contextBridge.exposeInMainWorld('api', {
  createAppointment: (payload: any) => ipcRenderer.invoke('db:createAppointment', payload),
  getAppointments: () => ipcRenderer.invoke('db:getAppointments'),
  deleteAppointment: (id: string) => ipcRenderer.invoke('db:deleteAppointment', id),
});