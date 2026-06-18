import { contextBridge, ipcRenderer } from 'electron';

// Expose IPC API to renderer process
contextBridge.exposeInMainWorld('api', {
  // Clientes
  getClientes: () => ipcRenderer.invoke('get-clientes'),
  getCliente: (nombre: string) => ipcRenderer.invoke('get-cliente', nombre),
  getClientesByNombre: (nombre: string) => ipcRenderer.invoke('get-clientes-by-nombre', nombre),
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
  getProductoById: (id: number) => ipcRenderer.invoke('get-producto-by-id', id),
  addProducto: (producto: any) => ipcRenderer.invoke('add-producto', producto),
  updateProducto: (producto: any) => ipcRenderer.invoke('update-producto', producto),
  deleteProducto: (id: number) => ipcRenderer.invoke('delete-producto', id),

  // Citas
  getCitas: () => ipcRenderer.invoke('get-citas'),
  addCita: (cita: any) => ipcRenderer.invoke('add-cita', cita),
  updateCita: (cita: any) => ipcRenderer.invoke('update-cita', cita),
  deleteCita: (id: number) => ipcRenderer.invoke('delete-cita', id),
  getCitasByFecha: (fecha: string) => ipcRenderer.invoke('get-citas-by-fecha', fecha),
  getCitasByFechaCliente: (fecha: string, nombreCliente: string) => ipcRenderer.invoke('get-citas-by-fecha-cliente', fecha, nombreCliente),
  getCitaByFechaCliente: (fecha: string, nombreCliente: string) => ipcRenderer.invoke('get-cita-by-fecha-cliente', fecha, nombreCliente),

  // Gastos
  getGastos: () => ipcRenderer.invoke('get-gastos'),
  getGastosByFecha: (fecha: string) => ipcRenderer.invoke('get-gastos-by-fecha', fecha),
  getGastosByCategoria: (categoria: string) => ipcRenderer.invoke('get-gastos-by-categoria', categoria),
  addGasto: (gasto: any) => ipcRenderer.invoke('add-gasto', gasto),
  updateGasto: (gasto: any) => ipcRenderer.invoke('update-gasto', gasto),
  deleteGasto: (id: number) => ipcRenderer.invoke('delete-gasto', id),
  getGastosTotals: () => ipcRenderer.invoke('get-gastos-totals'),
});
