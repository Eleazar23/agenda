import { test, expect } from "./fixtures";
import {
  aFechaHTML,
  buscarUno,
  dialogo,
  enDias,
  esperarAviso,
  filaGrid,
  buscarEnTabla,
  irA,
  sufijo,
} from "./helpers";

test.describe("Estilistas", () => {
  test("crea, edita, registra vacaciones y elimina un estilista", async ({
    window,
  }) => {
    // Sin espacios ni mayúsculas: el nombre se usa como id de columna en la agenda.
    const nombre = `e2e${sufijo()}`;
    const vacInicio = enDias(30);
    const vacFin = enDias(35);

    await irA(window, "Estilistas");

    // Crear
    await window.getByRole("button", { name: "Agregar Estilista" }).click();
    const alta = dialogo(window, "Agregar Estilista");
    await alta.locator('input[name="name"]').fill(nombre);
    await alta.locator('input[name="telefono"]').fill("5511112222");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Estilista agregado con éxito");
    await buscarEnTabla(window, nombre);
    await expect(filaGrid(window, nombre)).toBeVisible();
    const creado = await buscarUno("estilistas", { name: nombre });
    expect(creado?.telefono).toBe("5511112222");
    expect(creado?.role).toBe("estilista");

    // Editar
    await filaGrid(window, nombre).getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Estilista");
    await edicion.locator('input[name="telefono"]').fill("5599998888");
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Estilista actualizado con éxito");
    await expect
      .poll(async () => (await buscarUno("estilistas", { id: creado?.id }))?.telefono)
      .toBe("5599998888");
    await expect(edicion).toBeHidden();

    // Vacaciones
    await filaGrid(window, nombre)
      .getByRole("button", { name: "vacaciones" })
      .click();
    const vacaciones = dialogo(window, "Vacaciones de");
    await expect(vacaciones.getByText("Sin vacaciones registradas")).toBeVisible();
    await vacaciones.getByLabel("Inicio").fill(aFechaHTML(vacInicio));
    await vacaciones.getByLabel("Fin").fill(aFechaHTML(vacFin));
    await vacaciones.getByRole("button", { name: "Agregar" }).click();
    await expect(vacaciones.getByText(`${vacInicio} — ${vacFin}`)).toBeVisible();
    await vacaciones.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Estilista actualizado con éxito");
    await expect
      .poll(async () => (await buscarUno("estilistas", { id: creado?.id }))?.vacaciones)
      .toEqual([expect.objectContaining({ inicio: vacInicio, fin: vacFin })]);

    // Eliminar
    await filaGrid(window, nombre).getByRole("button", { name: "delete" }).click();
    await dialogo(window, "Eliminar Estilista")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Estilista eliminado con éxito");
    await expect(filaGrid(window, nombre)).toHaveCount(0);
    await expect
      .poll(() => buscarUno("estilistas", { id: creado?.id }))
      .toBeNull();
  });

  test("valida el teléfono al agregar", async ({ window }) => {
    const nombre = `e2e${sufijo()}`;
    await irA(window, "Estilistas");
    await window.getByRole("button", { name: "Agregar Estilista" }).click();
    const alta = dialogo(window, "Agregar Estilista");
    await alta.locator('input[name="name"]').fill(nombre);
    await alta.locator('input[name="telefono"]').fill("12345");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(
      window,
      "El número de teléfono debe tener al menos 10 dígitos",
    );
    await expect(alta).toBeVisible();
    expect(await buscarUno("estilistas", { name: nombre })).toBeNull();
  });
});
