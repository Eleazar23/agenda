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

test.describe("Productos", () => {
  test("crea, edita y elimina un producto", async ({ window }) => {
    const nombre = `E2E Producto ${sufijo()}`;

    await irA(window, "Productos");

    // Crear
    await window.getByRole("button", { name: "Agregar Producto" }).click();
    const alta = dialogo(window, "Agregar Producto");
    await alta.locator('input[name="nombre"]').fill(nombre);
    await alta.locator('input[name="marca"]').fill("Marca E2E");
    await alta.locator('input[name="precio"]').fill("120");
    await alta.locator('input[name="stock"]').fill("10");
    await alta.locator('textarea[name="descripcion"]').fill("Creado por e2e");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Producto agregado con éxito");
    await buscarEnTabla(window, nombre);
    await expect(filaGrid(window, nombre)).toBeVisible();
    const creado = await buscarUno("productos", { nombre });
    expect(creado?.marca).toBe("Marca E2E");
    expect(Number(creado?.precio)).toBe(120);
    expect(Number(creado?.stock)).toBe(10);

    // Editar
    await filaGrid(window, nombre).getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Producto");
    await edicion.locator('input[name="precio"]').fill("99.5");
    await edicion.locator('input[name="stock"]').fill("4");
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Producto actualizado con éxito");
    await expect
      .poll(async () => {
        const p = await buscarUno("productos", { id: creado?.id });
        return [Number(p?.precio), Number(p?.stock)];
      })
      .toEqual([99.5, 4]);

    // Eliminar
    await filaGrid(window, nombre).getByRole("button", { name: "delete" }).click();
    await dialogo(window, "Eliminar Producto")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Producto eliminado con éxito");
    await expect(filaGrid(window, nombre)).toHaveCount(0);
    await expect
      .poll(() => buscarUno("productos", { id: creado?.id }))
      .toBeNull();
  });

  test("valida los campos obligatorios", async ({ window }) => {
    await irA(window, "Productos");
    await window.getByRole("button", { name: "Agregar Producto" }).click();
    const alta = dialogo(window, "Agregar Producto");
    await alta.locator('input[name="nombre"]').fill("Ab");
    await alta.getByRole("button", { name: "Guardar" }).click();

    // Sin cerrar el modal ni guardar nada.
    await expect(alta).toBeVisible();
    await expect(alta.locator('input[name="nombre"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(alta.locator('input[name="marca"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(await buscarUno("productos", { nombre: "Ab" })).toBeNull();
  });
});
