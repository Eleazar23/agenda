import { contextBridge, ipcRenderer } from 'electron';

// Expose IPC API to renderer process
contextBridge.exposeInMainWorld('api', {
  // Clientes
  getClientes: () => ipcRenderer.invoke('get-clientes'),
  addCliente: (cliente: any) => ipcRenderer.invoke('add-cliente', cliente),
  updateCliente: (cliente: any) => ipcRenderer.invoke('update-cliente', cliente),
  deleteCliente: (id: number) => ipcRenderer.invoke('delete-cliente', id),

  // Estilistas
  getEstilistas: () => ipcRenderer.invoke('get-estilistas'),
  addEstilista: (estilista: any) => ipcRenderer.invoke('add-estilista', estilista),
  updateEstilista: (estilista: any) => ipcRenderer.invoke('update-estilista', estilista),
  deleteEstilista: (id: number) => ipcRenderer.invoke('delete-estilista', id),

  // Servicios
  getServicios: () => ipcRenderer.invoke('get-servicios'),
  addServicio: (servicio: any) => ipcRenderer.invoke('add-servicio', servicio),
  updateServicio: (servicio: any) => ipcRenderer.invoke('update-servicio', servicio),
  deleteServicio: (id: number) => ipcRenderer.invoke('delete-servicio', id),

  // Productos
  getProductos: () => ipcRenderer.invoke('get-productos'),
  addProducto: (producto: any) => ipcRenderer.invoke('add-producto', producto),
  updateProducto: (producto: any) => ipcRenderer.invoke('update-producto', producto),
  deleteProducto: (id: number) => ipcRenderer.invoke('delete-producto', id),

  // Citas
  getCitas: () => ipcRenderer.invoke('get-citas'),
  addCita: (cita: any) => ipcRenderer.invoke('add-cita', cita),
  updateCita: (cita: any) => ipcRenderer.invoke('update-cita', cita),
  deleteCita: (id: number) => ipcRenderer.invoke('delete-cita', id),
  getCitasByFecha: (fecha: string) => ipcRenderer.invoke('get-citas-by-fecha', fecha),
});
