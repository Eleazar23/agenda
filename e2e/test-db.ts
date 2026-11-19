// Base de datos dedicada y aislada para e2e. Nunca debe apuntar a "agenda"
// (la real): global-setup la siembra borrando todo lo que tenga, y
// global-teardown la elimina por completo al final de la corrida.
export const TEST_MONGODB_URI = "mongodb://127.0.0.1:27017/agenda_e2e_test";
