import type { IElectronAPI } from "../electron";
import type { Cliente } from "../types/Cliente";
import type { Estilista } from "../types/Estilista";
import type { Servicio } from "../types/Servicio";
import type { Producto, ProductoInCita } from "../types/Producto";
import type { Cita } from "../types/Cita";
import type { Gasto } from "../types/Gasto";
import type { Nota } from "../types/Nota";
import type { ServicioAgendado } from "../types/ServicioAgendado";
import { getCurrentDate, getOfficeHours } from "../utils/utils";

// In-memory mock of window.api for `npm run dev` (no Electron/MongoDB available).
// Data resets on page reload; it only exists for the lifetime of the browser tab.

const DELAY_MS = 150;
const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), DELAY_MS));

const nextId = (items: Array<{ id: number }>) =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const officeHours = getOfficeHours();

const findOfficeHour = (label24: string) => {
  const hour = officeHours.find((h) => h.label24 === label24);
  if (!hour) {
    throw new Error(`Hora fuera de horario de oficina: ${label24}`);
  }
  return hour;
};

const buildServicioAgendado = (
  servicio: Servicio,
  estilista: string,
  horaInicio: string,
  duracion: number,
  fecha: string,
): ServicioAgendado => {
  const startHour = findOfficeHour(horaInicio);
  const endHour = officeHours[startHour.index + duracion / 30];
  return {
    rowIndex: startHour.index,
    cellID: `${startHour.index}-${estilista}`,
    servicio,
    estilista,
    horaInicio: startHour.label24,
    horaFin: (endHour ?? startHour).label24,
    duracion,
    fecha,
  };
};

const today = getCurrentDate().formattedDate;

// ---------- Seed data ----------

let clientes: Cliente[] = [
  { id: 1, nombre: "Juan Perez", telefono: "5551234567", correo: "juan.perez@email.com", lastVisit: "10-01-2026" },
  { id: 2, nombre: "Maria Lopez", telefono: "5559876543", correo: "maria.lopez@email.com", lastVisit: "12-01-2026" },
  { id: 3, nombre: "Carlos Sanchez", telefono: "5554567890", correo: "carlos.sanchez@email.com", lastVisit: "08-01-2026" },
  { id: 4, nombre: "Ana Torres", telefono: "5556783456", correo: "ana.torres@email.com", lastVisit: "05-01-2026" },
  { id: 5, nombre: "Lupe Ramirez", telefono: "5552345678", correo: "lupe.ramirez@email.com", lastVisit: "01-01-2026" },
  { id: 6, nombre: "Roberto Diaz", telefono: "5558765432", correo: "roberto.diaz@email.com", lastVisit: "20-12-2025" },
];

let estilistas: Estilista[] = [
  { id: 1, name: "tomi", displayName: "Tomi", telefono: "5551112222", role: "estilista" },
  { id: 2, name: "felix", displayName: "Felix", telefono: "5553334444", role: "estilista" },
  { id: 3, name: "magi", displayName: "Magi", telefono: "5555556666", role: "estilista" },
];

let servicios: Servicio[] = [
  { id: 1, nombre: "Corte de Cabello", precio: 150 },
  { id: 2, nombre: "Manicura", precio: 80 },
  { id: 3, nombre: "Pedicura", precio: 100 },
  { id: 4, nombre: "Coloración", precio: 350 },
  { id: 5, nombre: "Peinado", precio: 90 },
  { id: 6, nombre: "Tinte", precio: 400 },
];

let productos: Producto[] = [
  { id: 1, nombre: "Shampoo", marca: "L'Oreal", precio: 50, descripcion: "Shampoo hidratante", stock: 20 },
  { id: 2, nombre: "Acondicionador", marca: "L'Oreal", precio: 60, descripcion: "Acondicionador reparador", stock: 15 },
  { id: 3, nombre: "Gel para cabello", marca: "Got2b", precio: 40, descripcion: "Fijación fuerte", stock: 30 },
  { id: 4, nombre: "Cera para cabello", marca: "American Crew", precio: 70, descripcion: "Acabado mate", stock: 10 },
  { id: 5, nombre: "Laca para cabello", marca: "Tresemme", precio: 80, descripcion: "Fijación extra fuerte", stock: 12 },
];

let citas: Cita[] = [
  {
    id: `${today}-1`,
    clienteId: 1,
    fecha: today,
    nombreCliente: "Juan Perez",
    telefonoCliente: "5551234567",
    servicios: [buildServicioAgendado(servicios[0], "tomi", "10:00", 30, today)],
    productos: [],
    estado: "sin confirmar",
    metodoDePago: "efectivo",
    notas: "",
  },
  {
    id: `${today}-2`,
    clienteId: 2,
    fecha: today,
    nombreCliente: "Maria Lopez",
    telefonoCliente: "5559876543",
    servicios: [
      buildServicioAgendado(servicios[1], "felix", "11:00", 30, today),
      buildServicioAgendado(servicios[2], "felix", "11:30", 30, today),
    ],
    productos: [],
    estado: "confirmado",
    metodoDePago: "tarjeta",
    notas: "",
  },
  {
    id: `${today}-3`,
    clienteId: 3,
    fecha: today,
    nombreCliente: "Carlos Sanchez",
    telefonoCliente: "5554567890",
    servicios: [buildServicioAgendado(servicios[3], "magi", "09:30", 120, today)],
    productos: [],
    estado: "en proceso",
    metodoDePago: "efectivo",
    notas: "Alergia leve al amoniaco",
  },
  {
    id: `${today}-4`,
    clienteId: 4,
    fecha: today,
    nombreCliente: "Ana Torres",
    telefonoCliente: "5556783456",
    servicios: [buildServicioAgendado(servicios[4], "tomi", "14:00", 30, today)],
    productos: [] as ProductoInCita[],
    estado: "pagado",
    metodoDePago: "efectivo",
    notas: "",
  },
  {
    id: `${today}-5`,
    clienteId: 5,
    fecha: today,
    nombreCliente: "Lupe Ramirez",
    telefonoCliente: "5552345678",
    servicios: [buildServicioAgendado(servicios[5], "felix", "09:00", 90, today)],
    productos: [],
    estado: "finalizado",
    metodoDePago: "transferencia",
    notas: "",
  },
  {
    id: `${today}-6`,
    clienteId: 6,
    fecha: today,
    nombreCliente: "Roberto Diaz",
    telefonoCliente: "5558765432",
    servicios: [buildServicioAgendado(servicios[0], "magi", "15:00", 30, today)],
    productos: [],
    estado: "no asistio",
    metodoDePago: "efectivo",
    notas: "",
  },
  // Historial adicional de Juan Perez para probar filtros de la bitácora
  {
    id: "hist-1",
    clienteId: 1,
    fecha: "10-01-2026",
    nombreCliente: "Juan Perez",
    telefonoCliente: "5551234567",
    servicios: [buildServicioAgendado(servicios[0], "tomi", "10:00", 30, "10-01-2026")],
    productos: [],
    estado: "completada",
    metodoDePago: "efectivo",
    notas: "Cliente pidió corte más corto de los lados.",
  },
  {
    id: "hist-2",
    clienteId: 1,
    fecha: "24-01-2026",
    nombreCliente: "Juan Perez",
    telefonoCliente: "5551234567",
    servicios: [
      buildServicioAgendado(servicios[4], "felix", "11:00", 90, "24-01-2026"),
      buildServicioAgendado(servicios[5], "felix", "12:30", 30, "24-01-2026"),
    ],
    productos: [],
    estado: "pagado",
    metodoDePago: "tarjeta",
    notas: "",
  },
  {
    id: "hist-3",
    clienteId: 1,
    fecha: "02-02-2026",
    nombreCliente: "Juan Perez",
    telefonoCliente: "5551234567",
    servicios: [buildServicioAgendado(servicios[0], "tomi", "09:00", 30, "02-02-2026")],
    productos: [],
    estado: "no asistio",
    metodoDePago: "",
    notas: "Cliente no llegó a la cita.",
  },
];

let gastos: Gasto[] = [
  { id: 1, proveedorNombre: "Distribuidora Bella", monto: 850, fecha: today, categoria: "insumos", descripcion: "Compra de shampoo y acondicionador", metodoPago: "efectivo" },
  { id: 2, proveedorNombre: "CFE", monto: 620, fecha: today, categoria: "servicios", descripcion: "Recibo de luz", metodoPago: "transferencia" },
];

let notas: Nota[] = [
  { id: 1, nota: "Confirmar cliente de las 10am", estilistaId: 1, estilistaNombre: "Tomi", estado: false, fecha: today },
  { id: 2, nota: "Pedir más tinte color chocolate", estilistaId: 2, estilistaNombre: "Felix", estado: false, fecha: today },
];

// ---------- API ----------

export function createMockApi(): IElectronAPI {
  return {
    // Clientes
    getClientes: () => delay([...clientes]),
    getCliente: (nombre) =>
      delay(clientes.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase()) as Cliente),
    getClientesByNombre: (nombre) =>
      delay(clientes.filter((c) => c.nombre.toLowerCase() === nombre.toLowerCase())),
    addCliente: (cliente) => {
      const newCliente = { ...cliente, id: nextId(clientes) } as Cliente;
      clientes = [...clientes, newCliente];
      return delay(newCliente);
    },
    updateCliente: (cliente) => {
      clientes = clientes.map((c) => (c.id === cliente.id ? { ...c, ...cliente } : c));
      return delay(cliente);
    },
    deleteCliente: (id) => {
      clientes = clientes.filter((c) => c.id !== id);
      return delay(undefined);
    },

    // Estilistas
    getEstilistas: () => delay([...estilistas]),
    addEstilista: (estilista) => {
      const newEstilista = { ...estilista, id: nextId(estilistas) } as Estilista;
      estilistas = [...estilistas, newEstilista];
      return delay(newEstilista);
    },
    updateEstilista: (estilista) => {
      estilistas = estilistas.map((e) => (e.id === estilista.id ? { ...e, ...estilista } : e));
      return delay(estilista);
    },
    deleteEstilista: (id) => {
      estilistas = estilistas.filter((e) => e.id !== id);
      return delay(undefined);
    },

    // Servicios
    getServicios: () => delay([...servicios]),
    addServicio: (servicio) => {
      const newServicio = { ...servicio, id: nextId(servicios) } as Servicio;
      servicios = [...servicios, newServicio];
      return delay(newServicio);
    },
    updateServicio: (servicio) => {
      servicios = servicios.map((s) => (s.id === servicio.id ? { ...s, ...servicio } : s));
      return delay(servicio);
    },
    deleteServicio: (id) => {
      servicios = servicios.filter((s) => s.id !== id);
      return delay(undefined);
    },

    // Productos
    getProductos: () => delay([...productos]),
    getProductoById: (id) => delay(productos.find((p) => p.id === id) as Producto),
    addProducto: (producto) => {
      const newProducto = { ...producto, id: nextId(productos) } as Producto;
      productos = [...productos, newProducto];
      return delay(newProducto);
    },
    updateProducto: (producto) => {
      productos = productos.map((p) => (p.id === producto.id ? { ...p, ...producto } : p));
      return delay(producto);
    },
    deleteProducto: (id) => {
      productos = productos.filter((p) => p.id !== id);
      return delay(undefined);
    },
    decrementProductoStock: (id, cantidad) => {
      const producto = productos.find((p) => p.id === id);
      if (!producto) return delay(null);
      const nuevoStock = producto.stock - cantidad;
      productos = productos.map((p) =>
        p.id === id ? { ...p, stock: nuevoStock >= 0 ? nuevoStock : 0 } : p,
      );
      return delay(productos.find((p) => p.id === id) as Producto);
    },

    // Citas
    getCitas: () => delay([...citas]),
    addCita: (cita) => {
      const newCita = { ...cita } as Cita;
      citas = [...citas, newCita];
      return delay(newCita);
    },
    updateCita: (cita) => {
      citas = citas.map((c) => (c.id === cita.id ? { ...c, ...cita } : c));
      return delay(citas.find((c) => c.id === cita.id) as Cita);
    },
    deleteCita: (id) => {
      citas = citas.filter((c) => c.id !== id);
      return delay(undefined);
    },
    getCitasByFecha: (fecha) => delay(citas.filter((c) => c.fecha === fecha)),
    getCitasByFechaClienteId: (fecha, clienteId) =>
      delay(citas.filter((c) => c.fecha === fecha && c.clienteId === clienteId)),
    getCitaByFechaClienteId: (fecha, clienteId) =>
      delay(citas.find((c) => c.fecha === fecha && c.clienteId === clienteId) ?? null),
    getCitasByCliente: (nombreCliente, telefonoCliente) =>
      delay(
        citas.filter(
          (c) => c.nombreCliente === nombreCliente && c.telefonoCliente === telefonoCliente,
        ),
      ),

    // Gastos
    getGastos: () => delay([...gastos]),
    getGastosByFecha: (fecha) => delay(gastos.filter((g) => g.fecha === fecha)),
    getGastosByCategoria: (categoria) => delay(gastos.filter((g) => g.categoria === categoria)),
    addGasto: (gasto) => {
      const newGasto = { ...gasto, id: nextId(gastos) } as Gasto;
      gastos = [...gastos, newGasto];
      return delay(newGasto);
    },
    updateGasto: (gasto) => {
      gastos = gastos.map((g) => (g.id === gasto.id ? { ...g, ...gasto } : g));
      return delay(gasto);
    },
    deleteGasto: (id) => {
      gastos = gastos.filter((g) => g.id !== id);
      return delay(undefined);
    },
    getGastosTotals: () => {
      const totals = new Map<string, { _id: string; total: number; count: number }>();
      gastos.forEach((g) => {
        const entry = totals.get(g.categoria) ?? { _id: g.categoria, total: 0, count: 0 };
        entry.total += g.monto;
        entry.count += 1;
        totals.set(g.categoria, entry);
      });
      return delay([...totals.values()].sort((a, b) => a._id.localeCompare(b._id)));
    },

    // Notas
    getNotas: () => delay([...notas]),
    getNotasByEstilista: (estilistaId) => delay(notas.filter((n) => n.estilistaId === estilistaId)),
    getNotasByFecha: (fecha) => delay(notas.filter((n) => n.fecha === fecha)),
    addNota: (nota) => {
      const newNota = { ...nota, id: nextId(notas) } as Nota;
      notas = [...notas, newNota];
      return delay(newNota);
    },
    updateNota: (nota) => {
      notas = notas.map((n) => (n.id === nota.id ? { ...n, ...nota } : n));
      return delay(nota);
    },
    deleteNota: (id) => {
      notas = notas.filter((n) => n.id !== id);
      return delay(undefined);
    },
  };
}

export function installMockApi() {
  if (window.api) return;
  window.api = createMockApi();
  console.info(
    "[mockApi] npm run dev sin Electron: usando datos de prueba en memoria (se reinician al recargar).",
  );
}
