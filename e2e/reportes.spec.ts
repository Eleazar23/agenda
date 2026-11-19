import { test, expect } from "./fixtures";
import { aFechaHTML, conDb, crearCitaDb, crearClienteDb, irA } from "./helpers";

// Fechas fijas lejos de "hoy" para que las citas pagadas que crean otros
// specs en la misma corrida no alteren los totales.
const DIA_1 = "10-06-2030";
const DIA_2 = "11-06-2030";
const DIA_8 = "17-06-2030";

test.describe("Reportes", () => {
  test.beforeAll(async () => {
    const clienteA = await crearClienteDb();
    const clienteB = await crearClienteDb();
    await crearCitaDb({
      cliente: clienteA,
      hora: "10:00",
      estilista: "tomi",
      servicio: { id: 4, nombre: "Pedicura", precio: "100" },
      estado: "pagado",
      fecha: DIA_1,
    });
    await crearCitaDb({
      cliente: clienteB,
      hora: "11:00",
      estilista: "felix",
      servicio: { id: 5, nombre: "Coloración", precio: "200" },
      estado: "pagado",
      fecha: DIA_2,
    });
    // Una cita no pagada no debe sumar.
    await crearCitaDb({
      cliente: clienteA,
      hora: "12:00",
      estilista: "felix",
      servicio: { id: 6, nombre: "Peinado", precio: "90" },
      estado: "confirmado",
      fecha: DIA_2,
    });
    await conDb((db) =>
      db.collection("gastos").insertOne({
        id: 900000 + Math.floor(Math.random() * 90000),
        proveedorNombre: "Proveedor reportes e2e",
        monto: 50,
        fecha: DIA_1,
        categoria: "Insumos",
        descripcion: "",
        metodoPago: "efectivo",
      }),
    );
  });

  test("muestra los totales del día y del periodo semanal", async ({ window }) => {
    await irA(window, "Reportes");
    // Tarjetas de totales (el menú lateral también tiene "Servicios"/"Gastos").
    const servicios = window.getByRole("button", { name: /^Servicios \$/ });
    const gastos = window.getByRole("button", { name: /^Gastos \$/ });

    // Diario
    await window.getByLabel("Fecha", { exact: true }).fill(aFechaHTML(DIA_1));
    await expect(servicios).toContainText("$100.00");
    await expect(gastos).toContainText("$50.00");
    await expect(window.getByRole("gridcell", { name: "Pedicura" })).toBeVisible();

    // Semanal: DIA_1 a DIA_2 suma solo las citas pagadas de ambos días.
    await window.getByLabel("Tipo de reporte").click();
    await window.getByRole("option", { name: "Semanal" }).click();
    await window.getByLabel("Fecha Fin").fill(aFechaHTML(DIA_2));
    await expect(servicios).toContainText("$300.00");
    await expect(gastos).toContainText("$50.00");
    await expect(window.getByRole("gridcell", { name: "Coloración" })).toBeVisible();
    await expect(window.getByRole("gridcell", { name: "Peinado" })).toHaveCount(0);
  });

  test("valida el máximo de días del reporte semanal", async ({ window }) => {
    await irA(window, "Reportes");
    await window.getByLabel("Fecha", { exact: true }).fill(aFechaHTML(DIA_1));
    await window.getByLabel("Tipo de reporte").click();
    await window.getByRole("option", { name: "Semanal" }).click();
    await window.getByLabel("Fecha Fin").fill(aFechaHTML(DIA_8));

    await expect(
      window.getByText("Máximo 7 días para el reporte semanal (8 seleccionados)"),
    ).toBeVisible();
    await expect(window.getByRole("button", { name: "Guardar Excel" })).toBeDisabled();
  });
});
