import { execFileSync } from "node:child_process";
import path from "node:path";
import { TEST_MONGODB_URI } from "./test-db";

// Siembra la base de pruebas aislada con datos conocidos (clientes,
// servicios, estilistas) antes de correr los specs. Usa el mismo
// dist-electron/seed.js que "npm run seed:db", apuntado a la base de
// pruebas vía MONGODB_URI, nunca a la real.
export default async function globalSetup() {
  const root = process.cwd();
  const seedScript = path.join(root, "dist-electron", "seed.js");

  execFileSync(process.execPath, [seedScript], {
    cwd: root,
    env: {
      ...process.env,
      MONGODB_URI: TEST_MONGODB_URI,
      SEED_CONFIRM: "yes",
    },
    stdio: "inherit",
  });
}
