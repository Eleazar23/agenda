import { defineConfig } from "@playwright/test";

// Pruebas e2e contra la app de Electron real (no un navegador), apuntada a
// una base MongoDB de pruebas aislada (ver e2e/test-db.ts). Un solo worker:
// las pruebas comparten esa misma base y una instancia de Electron por test.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
});
