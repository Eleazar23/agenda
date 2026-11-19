import { test, expect } from "./fixtures";
import {
  buscarUno,
  dialogo,
  esperarAviso,
  filaGrid,
  hoy,
  irA,
  sufijo,
} from "./helpers";

test.describe("Gastos", () => {
  test("crea, edita y elimina un gasto del día", async ({ window }) => {
    const proveedor = `E2E Proveedor ${sufijo()}`;

    await irA(window, "Gastos");

    // Crear (la fecha del formulario arranca en hoy)
    await window.getByRole("button", { name: "Agregar Gasto" }).click();
    const alta = dialogo(window, "Agregar Nuevo Gasto");
    await alta.getByLabel("Nombre del Proveedor").fill(proveedor);
    await alta.getByLabel("Monto").fill("150.5");
    await alta.getByLabel("Categoría").fill("Insumos");
    await alta.getByLabel("Descripción").fill("Creado por e2e");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Gasto agregado con éxito");
    await expect(filaGrid(window, proveedor)).toBeVisible();
    const creado = await buscarUno("gastos", { proveedorNombre: proveedor });
    expect(creado?.monto).toBe(150.5);
    expect(creado?.fecha).toBe(hoy());
    expect(creado?.categoria).toBe("Insumos");
    await expect(window.getByText("Total: $150.50")).toBeVisible();

    // Editar
    await filaGrid(window, proveedor).getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Gasto");
    await edicion.getByLabel("Monto").fill("200");
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Gasto actualizado con éxito");
    await expect
      .poll(async () => (await buscarUno("gastos", { id: creado?.id }))?.monto)
      .toBe(200);
    await expect(window.getByText("Total: $200.00")).toBeVisible();

    // Eliminar
    await filaGrid(window, proveedor).getByRole("button", { name: "delete" }).click();
    await dialogo(window, "Eliminar Gasto")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Gasto eliminado con éxito");
    await expect(filaGrid(window, proveedor)).toHaveCount(0);
    await expect.poll(() => buscarUno("gastos", { id: creado?.id })).toBeNull();
  });

  test("valida los campos obligatorios", async ({ window }) => {
    await irA(window, "Gastos");
    await window.getByRole("button", { name: "Agregar Gasto" }).click();
    const alta = dialogo(window, "Agregar Nuevo Gasto");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await expect(
      alta.getByText("El nombre del proveedor es requerido"),
    ).toBeVisible();
    await expect(alta.getByText("El monto debe ser mayor a 0")).toBeVisible();
    await expect(alta.getByText("La categoría es requerida")).toBeVisible();
  });
});
