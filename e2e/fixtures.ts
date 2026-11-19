import { test as base, _electron as electron } from "@playwright/test";
import type { ElectronApplication, Page } from "@playwright/test";
import { TEST_MONGODB_URI } from "./test-db";

type Fixtures = {
  electronApp: ElectronApplication;
  window: Page;
};

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  electronApp: async ({}, use) => {
    // Se pasa la RAÍZ del proyecto (no el .js directamente): así Electron la
    // trata como el app path real (de donde sale app.getAppPath(), usado en
    // main.ts para resolver dist-react/index.html), igual que "electron ."
    // en el script dev:electron. Pasar el .js directo rompe esa resolución.
    const app = await electron.launch({
      args: [process.cwd()],
      env: {
        ...process.env,
        // Apunta la app a la base de pruebas aislada, nunca a "agenda".
        MONGODB_URI: TEST_MONGODB_URI,
      },
    });
    await use(app);
    await app.close();
  },

  window: async ({ electronApp }, use) => {
    const window = await electronApp.firstWindow();
    await window.waitForLoadState("domcontentloaded");
    await use(window);
  },
});

export { expect } from "@playwright/test";
