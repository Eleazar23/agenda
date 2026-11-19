import dayjs from "dayjs";
import { test, expect } from "./fixtures";
import {
  buscarUno,
  celdaAgenda,
  dialogo,
  esperarAviso,
  hoy,
  recargarAgenda,
  sufijo,
} from "./helpers";

test.describe("Agenda — notas", () => {
  test("crea, marca cumplida, edita y elimina una nota", async ({ window }) => {
    const texto = `Nota e2e ${sufijo()}`;
    const textoEditado = `${texto} editada`;

    await recargarAgenda(window);
    await window.getByRole("button", { name: "notas" }).click();
    await window.getByRole("button", { name: "Agregar Nota" }).click();

    // Crear
    const alta = dialogo(window, "Agregar Nueva Nota");
    await alta.getByLabel("Nota", { exact: true }).fill(texto);
    await alta.getByLabel("Estilista").click();
    await window.getByRole("option", { name: "Tomi" }).click();
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Nota agregada con éxito");
    const item = window.getByRole("listitem").filter({ hasText: texto });
    await expect(item).toBeVisible();
    const creada = await buscarUno("notas", { nota: texto });
    expect(creada?.fecha).toBe(hoy());
    expect(creada?.estado).toBe(false);

    // Marcar cumplida
    await item.getByRole("checkbox").check();
    await expect
      .poll(async () => (await buscarUno("notas", { id: creada?.id }))?.estado)
      .toBe(true);

    // Editar
    await item.getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Nota");
    await edicion.getByLabel("Nota", { exact: true }).fill(textoEditado);
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Nota actualizada con éxito");
    await expect
      .poll(async () => (await buscarUno("notas", { id: creada?.id }))?.nota)
      .toBe(textoEditado);

    // Eliminar
    const itemEditado = window.getByRole("listitem").filter({ hasText: textoEditado });
    await itemEditado.getByRole("button", { name: "delete" }).click();
    await dialogo(window, "¿Estás seguro de eliminar esta nota?")
      .getByRole("button", { name: "Aceptar" })
      .click();

    await esperarAviso(window, "Nota eliminada con éxito");
    await expect(itemEditado).toHaveCount(0);
    await expect.poll(() => buscarUno("notas", { id: creada?.id })).toBeNull();
  });
});

test.describe("Agenda — feriados", () => {
  test("agrega y elimina un feriado del año", async ({ window }) => {
    // Un día del año que no sea hoy, para no bloquear la agenda de otros tests.
    const fin = dayjs().endOf("year");
    const fecha = (fin.isSame(dayjs(), "day") ? fin.subtract(1, "day") : fin).format(
      "DD-MM-YYYY",
    );
    const nombre = `Feriado e2e ${sufijo()}`;
    const [dia, mes, anio] = fecha.split("-");

    await recargarAgenda(window);
    await window.getByRole("button", { name: "Feriado" }).click();
    const modal = dialogo(window, /^Feriados \d{4}/);
    await modal.getByLabel("Fecha").fill(`${anio}-${mes}-${dia}`);
    await modal.getByLabel("Nombre").fill(nombre);
    await modal.getByRole("button", { name: "Agregar" }).click();

    await esperarAviso(window, "Feriado agregado");
    const fila = modal.getByText(`${fecha} — ${nombre}`);
    await expect(fila).toBeVisible();
    expect(await buscarUno("feriados", { nombre })).toMatchObject({ fecha });

    await fila.locator("..").getByRole("button").click();
    await esperarAviso(window, "Feriado eliminado");
    await expect(fila).toHaveCount(0);
    await expect.poll(() => buscarUno("feriados", { nombre })).toBeNull();
  });
});

test.describe("Agenda — descansos", () => {
  test("marca un descanso en la agenda y lo elimina", async ({ window }) => {
    const motivo = `Descanso e2e ${sufijo()}`;

    await recargarAgenda(window);
    await window.getByRole("button", { name: "Descanso" }).click();
    // Por defecto: primer estilista (tomi), 09:00 a 09:30.
    const modal = dialogo(window, "Marcar descanso");
    await modal.getByLabel("Motivo").fill(motivo);
    await modal.getByRole("button", { name: "Marcar descanso" }).click();

    await esperarAviso(window, "Descanso agregado a la agenda");
    const celda = celdaAgenda(window, "09:00", "tomi");
    await expect(celda).toContainText(motivo);
    expect(
      await buscarUno("bloqueos", { motivo, fecha: hoy(), estilista: "tomi" }),
    ).toMatchObject({ horaInicio: "09:00", horaFin: "09:30" });

    await celda.getByText(motivo).click();
    await dialogo(window, "Eliminar descanso")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Descanso eliminado");
    await expect(celda).not.toContainText(motivo);
    await expect.poll(() => buscarUno("bloqueos", { motivo })).toBeNull();
  });
});
