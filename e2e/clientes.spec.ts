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

test.describe("Clientes", () => {
  test("crea, edita y elimina un cliente", async ({ window }) => {
    const nombre = `E2E Cliente ${sufijo()}`;
    const nombreEditado = `${nombre} Editado`;
    const telefono = "5512345678";

    await irA(window, "Clientes");

    // Crear
    await window.getByRole("button", { name: "Agregar Cliente" }).click();
    const alta = dialogo(window, "Agregar Cliente");
    await alta.locator('input[name="nombre"]').fill(nombre);
    await alta.locator('input[name="telefono"]').fill(telefono);
    await alta.locator('input[name="correo"]').fill("e2e@ejemplo.com");
    await alta.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Cliente agregado con éxito");
    await buscarEnTabla(window, nombre);
    await expect(filaGrid(window, nombre)).toBeVisible();
    const creado = await buscarUno("clientes", { nombre });
    expect(creado?.telefono).toBe(telefono);
    expect(creado?.correo).toBe("e2e@ejemplo.com");

    // Editar
    await filaGrid(window, nombre).getByRole("button", { name: "editar" }).click();
    const edicion = dialogo(window, "Editar Cliente");
    await edicion.locator('input[name="nombre"]').fill(nombreEditado);
    await edicion.getByRole("button", { name: "Guardar" }).click();

    await esperarAviso(window, "Cliente actualizado con éxito");
    await expect(filaGrid(window, nombreEditado)).toBeVisible();
    await expect
      .poll(async () => (await buscarUno("clientes", { id: creado?.id }))?.nombre)
      .toBe(nombreEditado);

    // Eliminar
    await filaGrid(window, nombreEditado)
      .getByRole("button", { name: "delete" })
      .click();
    await dialogo(window, "Eliminar Cliente")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(window, "Cliente eliminado con éxito");
    await expect(filaGrid(window, nombreEditado)).toHaveCount(0);
    await expect
      .poll(() => buscarUno("clientes", { id: creado?.id }))
      .toBeNull();
  });

  test("valida los campos obligatorios al agregar", async ({ window }) => {
    await irA(window, "Clientes");
    await window.getByRole("button", { name: "Agregar Cliente" }).click();
    const alta = dialogo(window, "Agregar Cliente");

    await alta.getByRole("button", { name: "Guardar" }).click();
    await expect(alta.getByText("El nombre es requerido")).toBeVisible();
    await expect(alta.getByText("El teléfono es requerido")).toBeVisible();

    await alta.locator('input[name="nombre"]').fill("Ab");
    await alta.locator('input[name="telefono"]').fill("123");
    await alta.locator('input[name="correo"]').fill("no-es-correo");
    await alta.getByRole("button", { name: "Guardar" }).click();
    await expect(
      alta.getByText("El nombre debe tener al menos 3 caracteres"),
    ).toBeVisible();
    await expect(
      alta.getByText("El teléfono debe tener al menos 10 dígitos"),
    ).toBeVisible();
    await expect(alta.getByText("El correo no es válido")).toBeVisible();

    // El modal sigue abierto y no se guardó nada.
    await expect(alta).toBeVisible();
    expect(await buscarUno("clientes", { nombre: "Ab" })).toBeNull();
  });

  test("no permite eliminar un cliente con citas en su historial", async ({
    window,
  }) => {
    // Juan Perez tiene 4 citas sembradas en global-setup.
    await irA(window, "Clientes");
    await buscarEnTabla(window, "Juan Perez");
    await filaGrid(window, "Juan Perez")
      .getByRole("button", { name: "delete" })
      .click();
    await dialogo(window, "Eliminar Cliente")
      .getByRole("button", { name: "Eliminar" })
      .click();

    await esperarAviso(
      window,
      "No se puede eliminar: el cliente tiene 4 cita(s) en su historial",
    );
    await expect(filaGrid(window, "Juan Perez")).toBeVisible();
    expect(await buscarUno("clientes", { nombre: "Juan Perez" })).not.toBeNull();
  });

  test("muestra la bitácora de visitas del cliente", async ({ window }) => {
    await irA(window, "Clientes");
    await buscarEnTabla(window, "Juan Perez");
    await filaGrid(window, "Juan Perez")
      .getByRole("button", { name: "bitacora" })
      .click();

    const bitacora = dialogo(window, "Historial de Visitas");
    await expect(bitacora.getByText("Juan Perez - 5551234567")).toBeVisible();

    // Por defecto filtra por hoy; se elige un día con cita sembrada.
    await bitacora.getByLabel("Fecha").click();
    await window.getByRole("option", { name: "10-01-2026" }).click();
    await expect(bitacora.getByText("Corte de cabello H")).toBeVisible();
    await expect(bitacora.getByText("completada")).toBeVisible();
  });
});
