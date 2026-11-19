import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import {
  buscarUno,
  celdaAgenda,
  conDb,
  crearCitaDb,
  crearClienteDb,
  esperarAviso,
  recargarAgenda,
} from "./helpers";

// Cada test usa su propio cliente y un horario/estilista distinto para no
// chocar con las citas de otros tests (la base se comparte en la corrida).

async function abrirCita(page: Page, hora: string, estilista: string, nombre: string) {
  await recargarAgenda(page);
  const celda = celdaAgenda(page, hora, estilista);
  await expect(celda).toContainText(nombre.split(" ")[0]);
  await celda.getByText(nombre, { exact: false }).first().click();
  const modal = page.getByRole("dialog").filter({ hasText: nombre });
  await expect(modal).toBeVisible();
  return modal;
}

test.describe("Agenda — editar cita", () => {
  test("cambia el estado desde la barra resumen y guarda", async ({ window }) => {
    const cliente = await crearClienteDb();
    const cita = await crearCitaDb({ cliente, hora: "11:00", estilista: "felix" });

    const modal = await abrirCita(window, "11:00", "felix", cliente.nombre);
    await modal.getByRole("button", { name: "Estado de la cita: Confirmado" }).click();
    await window.getByRole("menuitem", { name: "Finalizado" }).click();
    await modal.getByRole("button", { name: "Guardar", exact: true }).click();

    await esperarAviso(window, "Cita actualizada");
    await expect(modal).toBeHidden();
    await expect
      .poll(async () => (await buscarUno("citas", { id: cita.id }))?.estado)
      .toBe("finalizado");
  });

  test("cobra la cita eligiendo el método de pago en el popover", async ({
    window,
  }) => {
    const cliente = await crearClienteDb();
    const cita = await crearCitaDb({ cliente, hora: "12:00", estilista: "felix" });

    const modal = await abrirCita(window, "12:00", "felix", cliente.nombre);
    await modal.getByRole("button", { name: "Total Cita" }).click();
    await modal.getByRole("button", { name: "Cobrar ✓" }).click();

    const popover = window.getByRole("dialog", { name: "Método de pago" });
    await expect(popover.getByText("$80.00")).toBeVisible();
    await popover.getByRole("button", { name: "Transferencia" }).click();
    await popover.getByRole("button", { name: "Confirmar cobro" }).click();

    await esperarAviso(window, "Cita actualizada");
    await expect
      .poll(async () => {
        const guardada = await buscarUno("citas", { id: cita.id });
        return [guardada?.estado, guardada?.metodoDePago];
      })
      .toEqual(["pagado", "transferencia"]);
  });

  test("vende un producto en la cita y ajusta el stock", async ({ window }) => {
    const cliente = await crearClienteDb();
    const cita = await crearCitaDb({ cliente, hora: "13:00", estilista: "arturo" });
    await conDb((db) =>
      db.collection("productos").updateOne({ nombre: "Shampoo" }, { $set: { stock: 5 } }),
    );
    const stockDe = async () =>
      Number((await buscarUno("productos", { nombre: "Shampoo" }))?.stock);

    const modal = await abrirCita(window, "13:00", "arturo", cliente.nombre);
    await modal.getByRole("button", { name: "Agregar", exact: true }).click();

    await modal.getByPlaceholder("Buscar producto…").click();
    await window.getByRole("option", { name: /^Shampoo - / }).click();
    await modal
      .getByRole("combobox")
      .filter({ hasText: "Selecciona un estilista" })
      .click();
    await window.getByRole("option", { name: "Tomi" }).click();
    await modal.getByRole("button", { name: "aumentar cantidad" }).first().click();
    await expect(modal.getByText("Subtotal $100.00")).toBeVisible();
    await modal.getByRole("button", { name: "Agregar", exact: true }).click();

    // Se guarda en BD al momento (sin tocar Guardar) y descuenta stock.
    await expect(modal.getByText("$100.00").first()).toBeVisible();
    await expect
      .poll(async () => (await buscarUno("citas", { id: cita.id }))?.productos)
      .toEqual([expect.objectContaining({ nombre: "Shampoo", cantidad: 2, estilista: "tomi" })]);
    await expect.poll(stockDe).toBe(3);

    // Quitar el producto repone el stock.
    await modal.getByRole("button", { name: "quitar producto" }).click();
    await expect
      .poll(async () => (await buscarUno("citas", { id: cita.id }))?.productos)
      .toEqual([]);
    await expect.poll(stockDe).toBe(5);
  });

  test("elimina la cita al quitar su único servicio", async ({ window }) => {
    const cliente = await crearClienteDb();
    const cita = await crearCitaDb({ cliente, hora: "14:00", estilista: "magi" });

    const modal = await abrirCita(window, "14:00", "magi", cliente.nombre);
    await modal.getByRole("button", { name: "delete" }).click();
    await window.getByRole("button", { name: "Si", exact: true }).click();

    await esperarAviso(window, "Cita eliminada por no tener servicios");
    await expect.poll(() => buscarUno("citas", { id: cita.id })).toBeNull();
  });

  test("cancela la cita conservando el historial y libera el horario", async ({
    window,
  }) => {
    const cliente = await crearClienteDb();
    const cita = await crearCitaDb({ cliente, hora: "15:00", estilista: "arturo" });

    const modal = await abrirCita(window, "15:00", "arturo", cliente.nombre);
    await modal.getByRole("button", { name: "Estado de la cita: Confirmado" }).click();
    await window.getByRole("menuitem", { name: "Cancelado" }).click();
    await modal.getByRole("button", { name: "Guardar", exact: true }).click();

    await esperarAviso(window, "Cita cancelada");
    await expect.poll(() => buscarUno("citas", { id: cita.id })).toBeNull();
    const cancelada = await buscarUno("citas", {
      id: { $regex: `^${cita.id}-cancelada-` },
    });
    expect(cancelada?.estado).toBe("cancelado");
    await expect(celdaAgenda(window, "15:00", "arturo")).not.toContainText(
      cliente.nombre.split(" ")[0],
    );
  });
});
