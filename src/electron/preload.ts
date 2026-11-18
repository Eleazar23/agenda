import { contextBridge, ipcRenderer } from 'electron';

// Expose IPC API to renderer process
contextBridge.exposeInMainWorld('api', {
  // Clientes
  getClientes: () => ipcRenderer.invoke('get-clientes'),
  getCliente: (nombre: string) => ipcRenderer.invoke('get-cliente', nombre),
  getClientesByNombre: (nombre: string) => ipcRenderer.invoke('get-clientes-by-nombre', nombre),
  addCliente: (cliente: unknown) => ipcRenderer.invoke('add-cliente', cliente),
  updateCliente: (cliente: unknown) => ipcRenderer.invoke('update-cliente', cliente),
  deleteCliente: (id: number) => ipcRenderer.invoke('delete-cliente', id),

  // Estilistas
  getEstilistas: () => ipcRenderer.invoke('get-estilistas'),
  addEstilista: (estilista: unknown) => ipcRenderer.invoke('add-estilista', estilista),
  updateEstilista: (estilista: unknown) => ipcRenderer.invoke('update-estilista', estilista),
  deleteEstilista: (id: number) => ipcRenderer.invoke('delete-estilista', id),

  // Servicios
  getServicios: () => ipcRenderer.invoke('get-servicios'),
  addServicio: (servicio: unknown) => ipcRenderer.invoke('add-servicio', servicio),
  updateServicio: (servicio: unknown) => ipcRenderer.invoke('update-servicio', servicio),
  deleteServicio: (id: number) => ipcRenderer.invoke('delete-servicio', id),

  // Productos
  getProductos: () => ipcRenderer.invoke('get-productos'),
  getProductoById: (id: number) => ipcRenderer.invoke('get-producto-by-id', id),
  addProducto: (producto: unknown) => ipcRenderer.invoke('add-producto', producto),
  updateProducto: (producto: unknown) => ipcRenderer.invoke('update-producto', producto),
  deleteProducto: (id: number) => ipcRenderer.invoke('delete-producto', id),
  decrementProductoStock: (id: number, cantidad: number) => ipcRenderer.invoke('decrement-producto-stock', id, cantidad),

  // Citas
  getCitas: () => ipcRenderer.invoke('get-citas'),
  addCita: (cita: unknown) => ipcRenderer.invoke('add-cita', cita),
  updateCita: (cita: unknown) => ipcRenderer.invoke('update-cita', cita),
  deleteCita: (id: number) => ipcRenderer.invoke('delete-cita', id),
  getCitasByFecha: (fecha: string) => ipcRenderer.invoke('get-citas-by-fecha', fecha),
  getCitasByFechaClienteId: (fecha: string, clienteId: number) => ipcRenderer.invoke('get-citas-by-fecha-clienteid', fecha, clienteId),
  getCitaByFechaClienteId: (fecha: string, clienteId: number) => ipcRenderer.invoke('get-cita-by-fecha-clienteid', fecha, clienteId),
  getCitaById: (id: string) => ipcRenderer.invoke('get-cita-by-id', id),
  getCitasByCliente: (clienteId: number, nombreCliente: string, telefonoCliente: string) => ipcRenderer.invoke('get-citas-by-cliente', clienteId, nombreCliente, telefonoCliente),

  // Gastos
  getGastos: () => ipcRenderer.invoke('get-gastos'),
  getGastosByFecha: (fecha: string) => ipcRenderer.invoke('get-gastos-by-fecha', fecha),
  getGastosByCategoria: (categoria: string) => ipcRenderer.invoke('get-gastos-by-categoria', categoria),
  addGasto: (gasto: unknown) => ipcRenderer.invoke('add-gasto', gasto),
  updateGasto: (gasto: unknown) => ipcRenderer.invoke('update-gasto', gasto),
  deleteGasto: (id: number) => ipcRenderer.invoke('delete-gasto', id),
  getGastosTotals: () => ipcRenderer.invoke('get-gastos-totals'),

  // Notas
  getNotas: () => ipcRenderer.invoke('get-notas'),
  getNotasByEstilista: (estilistaId: number) => ipcRenderer.invoke('get-notas-by-estilista', estilistaId),
  getNotasByFecha: (fecha: string) => ipcRenderer.invoke('get-notas-by-fecha', fecha),
  addNota: (nota: unknown) => ipcRenderer.invoke('add-nota', nota),
  updateNota: (nota: unknown) => ipcRenderer.invoke('update-nota', nota),
  deleteNota: (id: number) => ipcRenderer.invoke('delete-nota', id),

  // Feriados
  getFeriadosByAnio: (anio: number) => ipcRenderer.invoke('get-feriados-by-anio', anio),
  addFeriado: (feriado: unknown) => ipcRenderer.invoke('add-feriado', feriado),
  deleteFeriado: (id: number) => ipcRenderer.invoke('delete-feriado', id),

  // Bloqueos
  getBloqueosByFecha: (fecha: string) => ipcRenderer.invoke('get-bloqueos-by-fecha', fecha),
  addBloqueo: (bloqueo: unknown) => ipcRenderer.invoke('add-bloqueo', bloqueo),
  deleteBloqueo: (id: number) => ipcRenderer.invoke('delete-bloqueo', id),
});
