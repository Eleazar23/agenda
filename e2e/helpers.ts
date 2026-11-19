import mongoose from "mongoose";
import dayjs from "dayjs";
import type { Locator, Page } from "@playwright/test";
import { expect } from "./fixtures";
import { TEST_MONGODB_URI } from "./test-db";

// ---------- Fechas ----------

// Mismo formato interno que usa la app (DD-MM-YYYY).
export const hoy = () => dayjs().format("DD-MM-YYYY");
export const enDias = (dias: number) =>
  dayjs().add(dias, "day").format("DD-MM-YYYY");

// DD-MM-YYYY → YYYY-MM-DD, el formato que acepta <input type="date">.
export const aFechaHTML = (fecha: string) => {
  const [dia, mes, anio] = fecha.split("-");
  return `${anio}-${mes}-${dia}`;
};

// Sufijo corto para que cada test cree datos que no choquen con otros.
export const sufijo = () =>
  `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

// ---------- Base de datos de pruebas ----------

export async function conDb<T>(
  fn: (db: mongoose.mongo.Db) => Promise<T>,
): Promise<T> {
  const conn = await mongoose.createConnection(TEST_MONGODB_URI).asPromise();
  try {
    return await fn(conn.db!);
  } finally {
    await conn.close();
  }
}

export const buscarUno = (coleccion: string, filtro: Record<string, unknown>) =>
  conDb((db) => db.collection(coleccion).findOne(filtro));

// La agenda arranca a las 09:00 en filas de 30 min (rowIndex 0 = 09:00).
const rowIndexDe = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return (h - 9) * 2 + (m >= 30 ? 1 : 0);
};

const sumarMinutos = (hora: string, minutos: number) =>
  dayjs(`2000-01-01 ${hora}`).add(minutos, "minute").format("HH:mm");

export async function crearClienteDb() {
  const id = 100000 + Math.floor(Math.random() * 800000);
  const cliente = {
    id,
    nombre: `E2E Cliente ${sufijo()}`,
    telefono: `55${String(id).padStart(8, "0")}`,
    correo: "",
    lastVisit: "",
  };
  await conDb((db) => db.collection("clientes").insertOne({ ...cliente }));
  return cliente;
}

type CitaDb = {
  cliente: { id: number; nombre: string; telefono: string };
  hora: string;
  estilista: string;
  servicio?: { id: number; nombre: string; precio: string };
  duracion?: number;
  estado?: string;
  fecha?: string;
};

// Inserta una cita con la misma forma que guarda la app (id = fecha-clienteId).
export async function crearCitaDb({
  cliente,
  hora,
  estilista,
  servicio = { id: 3, nombre: "Manicura", precio: "80" },
  duracion = 30,
  estado = "confirmado",
  fecha = hoy(),
}: CitaDb) {
  const rowIndex = rowIndexDe(hora);
  const cita = {
    id: `${fecha}-${cliente.id}`,
    clienteId: cliente.id,
    fecha,
    nombreCliente: cliente.nombre,
    telefonoCliente: cliente.telefono,
    servicios: [
      {
        rowIndex,
        cellID: `${rowIndex}-${estilista}`,
        fecha,
        estilista,
        servicio,
        horaInicio: hora,
        horaFin: sumarMinutos(hora, duracion),
        duracion,
      },
    ],
    productos: [],
    propinas: [],
    estado,
    metodoDePago: "efectivo",
    notas: "",
  };
  await conDb((db) => db.collection("citas").insertOne({ ...cita }));
  return cita;
}

// ---------- UI ----------

export async function irA(page: Page, modulo: string) {
  await page.getByRole("link", { name: modulo, exact: true }).click();
}

export async function esperarAviso(page: Page, texto: string | RegExp) {
  await expect(page.getByText(texto).first()).toBeVisible();
}

// Las tablas CRUD paginan según el alto de la ventana: un registro recién
// creado puede quedar en otra página, así que se filtra con el buscador.
export async function buscarEnTabla(page: Page, texto: string) {
  await page.getByPlaceholder(/^Buscar/).fill(texto);
}

// Fila de una tabla ag-grid que contiene el texto (las tablas CRUD no tienen
// columnas fijadas, así que toda la fila vive en el contenedor central).
export const filaGrid = (page: Page, texto: string): Locator =>
  page.locator(".ag-center-cols-container .ag-row").filter({ hasText: texto });

export const dialogo = (page: Page, titulo: string | RegExp): Locator =>
  page.getByRole("dialog").filter({ hasText: titulo });

export const celdaAgenda = (page: Page, hora: string, estilista: string) =>
  page.locator(`[row-id="${hora}"] [col-id="${estilista}"]`);

// Recarga para que la app lea los datos insertados directo en la BD.
export async function recargarAgenda(page: Page) {
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
  await expect(celdaAgenda(page, "09:00", "tomi")).toBeVisible({
    timeout: 15_000,
  });
}
