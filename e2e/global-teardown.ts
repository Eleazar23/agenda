import mongoose from "mongoose";
import { TEST_MONGODB_URI } from "./test-db";

// Elimina por completo la base de pruebas al terminar la corrida, para no
// dejar basura acumulándose entre ejecuciones.
export default async function globalTeardown() {
  await mongoose.connect(TEST_MONGODB_URI);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}
