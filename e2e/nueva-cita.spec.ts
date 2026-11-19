import mongoose from "mongoose";
import { test, expect } from "./fixtures";
import { TEST_MONGODB_URI } from "./test-db";

test.describe("Nueva Cita", () => {
  test("crea una cita nueva y queda persistida en MongoDB", async ({
    window,
  }) => {
    const estilista = "tomi"; // sembrado por e2e/global-setup.ts
    const hora = "10:00";
    const nombreCliente = `E2E Test ${Date.now()}`;
    const telefono = "5500000000";

    // Abrir Nueva Cita haciendo click en una celda vacía de la agenda.
    const celda = window.locator(
      `[row-id="${hora}"] [col-id="${estilista}"] button`,
    );
    await celda.waitFor({ state: "visible", timeout: 15_000 });
    await celda.click();

    // Cliente nuevo: llenar nombre/teléfono y guardarlo.
    await window.locator("#nueva-cita-nombre-cliente").fill(nombreCliente);
    await window.locator("#nueva-cita-telefono-cliente").fill(telefono);
    await window.getByRole("button", { name: "Guardar nuevo cliente" }).click();
    await expect(window.getByText("Cliente existente")).toBeVisible();

    // Elegir un servicio sembrado. El input de Servicio no usa getByLabel
    // porque "Servicio" hace match parcial con otros elementos de la UI
    // (el link "Servicios" del sidebar, "Colapsar servicio", etc.); se
    // ubica por su id explícito (servicioInputId en utils.tsx).
    const servicioInputId = await window.evaluate(() => {
      const el = document.querySelector('[id^="servicio-input-"]');
      return el?.id ?? null;
    });
    expect(servicioInputId).toBeTruthy();
    await window.locator(`#${servicioInputId}`).click();
    await window
      .getByRole("option", { name: /Corte de cabello H/ })
      .click();

    // Guardar la cita.
    await window.getByRole("button", { name: "Guardar" }).click();
    await expect(window.getByText("Cita guardada con éxito")).toBeVisible();

    // Verificar la persistencia real en MongoDB (no solo el feedback de la UI).
    await mongoose.connect(TEST_MONGODB_URI);
    try {
      const citaGuardada = await mongoose.connection
        .collection("citas")
        .findOne({ nombreCliente });

      expect(citaGuardada).toBeTruthy();
      expect(citaGuardada?.telefonoCliente).toBe(telefono);
      expect(citaGuardada?.servicios).toHaveLength(1);
      expect(citaGuardada?.servicios[0]?.estilista).toBe(estilista);
      expect(citaGuardada?.servicios[0]?.servicio?.nombre).toBe(
        "Corte de cabello H",
      );
    } finally {
      await mongoose.disconnect();
    }
  });
});
