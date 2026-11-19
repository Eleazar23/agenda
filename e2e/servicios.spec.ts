import { test, expect } from "./fixtures";
import {
  buscarUno,
  dialogo,
  esperarAviso,
  filaGrid,
  buscarEnTabla,
  irA,
  sufijo,
} from "./helpers";

test.describe("Servicios", () => {
  test("crea, edita y elimina un servicio", async ({ window }) => {
    const nombre = `E2E Servicio ${sufijo()}`;

    await irA(window, "Servicios");

    // Crear
    await window.getByRole("button", { name: "Agregar Servicio" }).click();
    const alta = dialogo(window, "Agregar Servicio");
    await alta.locator('input[name="nombre"]').fill(nombre);
    await alta.locator('input[name="precio"]').fill("250");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Servicio agregado con éxito");
    await buscarEnTabla(window, nombre);
    await expect(filaGrid(window, nombre)).toBeVisible();
    const creado = await buscarUno("servicios", { nombre });
    expect(Number(creado?.precio)).toBe(250);

    // Editar
    await filaGrid(window, nombre).getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Servicio");
    await edicion.locator('input[name="precio"]').fill("300");
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Servicio actualizado con éxito");
    await expect
      .poll(async () => Number((await buscarUno("servicios", { id: creado?.id }))?.precio))
      .toBe(300);

    // Eliminar
    await filaGrid(window, nombre).getByRole("button", { name: "delete" }).click();
    await dialogo(window, "Eliminar Servicio")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Servicio eliminado con éxito");
    await expect(filaGrid(window, nombre)).toHaveCount(0);
    await expect
      .poll(() => buscarUno("servicios", { id: creado?.id }))
      .toBeNull();
  });

  test("valida nombre y precio", async ({ window }) => {
    await irA(window, "Servicios");
    await window.getByRole("button", { name: "Agregar Servicio" }).click();
    const alta = dialogo(window, "Agregar Servicio");
    await alta.locator('input[name="nombre"]').fill("Ab");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await expect(
      alta.getByText("El nombre debe tener al menos 3 caracteres"),
    ).toBeVisible();
    await expect(alta).toBeVisible();
    expect(await buscarUno("servicios", { nombre: "Ab" })).toBeNull();
  });
});
