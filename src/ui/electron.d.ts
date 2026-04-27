import { Cliente } from './types/Cliente';
import { Estilista } from './types/Estilista';
import { Servicio } from './types/Servicio';
import { Producto } from './types/Producto';
import { Cita } from './types/Cita';
import { Gasto } from './types/Gasto';

export interface IElectronAPI {
  // Clientes
  getClientes: () => Promise<Cliente[]>;
  getCliente: (nombre: string) => Promise<Cliente>;
  getClientesByNombre: (nombre: string) => Promise<Cliente[]>,
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<Cliente>;
  updateCliente: (cliente: Cliente) => Promise<Cliente>;
  deleteCliente: (id: number) => Promise<void>;

  // Estilistas
  getEstilistas: () => Promise<Estilista[]>;
  addEstilista: (estilista: Omit<Estilista, 'id'>) => Promise<Estilista>;
  updateEstilista: (estilista: Estilista) => Promise<Estilista>;
  deleteEstilista: (id: number) => Promise<void>;

  // Servicios
  getServicios: () => Promise<Servicio[]>;
  addServicio: (servicio: Omit<Servicio, 'id'>) => Promise<Servicio>;
  updateServicio: (servicio: Servicio) => Promise<Servicio>;
  deleteServicio: (id: number) => Promise<void>;

  // Productos
  getProductos: () => Promise<Producto[]>;
  addProducto: (producto: Omit<Producto, 'id'>) => Promise<Producto>;
  updateProducto: (producto: Producto) => Promise<Producto>;
  deleteProducto: (id: number) => Promise<void>;

  // Citas
  getCitas: () => Promise<Cita[]>;
  addCita: (cita: Omit<Cita, 'id'>) => Promise<Cita>;
  updateCita: (cita: Cita) => Promise<Cita>;
  deleteCita: (id: number) => Promise<void>;
  getCitasByFecha: (fecha: string) => Promise<Cita[]>;
  getCitasByFechaCliente: (fecha: string, nombreCliente: string) => Promise<Cita[]>;
  getCitaByFechaCliente: (fecha: string, nombreCliente: string) => Promise<Cita | null>;

  // Gastos
  getGastos: () => Promise<Gasto[]>;
  getGastosByFecha: (fecha: string) => Promise<Gasto[]>;
  getGastosByCategoria: (categoria: string) => Promise<Gasto[]>;
  addGasto: (gasto: Omit<Gasto, 'id'>) => Promise<Gasto>;
  updateGasto: (gasto: Gasto) => Promise<Gasto>;
  deleteGasto: (id: number) => Promise<void>;
  getGastosTotals: () => Promise<Array<{ _id: string; total: number; count: number }>>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
