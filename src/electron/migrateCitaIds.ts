import mongoose from 'mongoose';
import { Cita } from './models/Cita.js';

// Corrige citas cuyo campo `id` (clave compuesta fecha-clienteId) quedó
// desincronizado de su campo `fecha` real, por ejemplo tras usar la función
// de "cambiar fecha" de una cita antes de que existiera la corrección que
// mantiene el id sincronizado. Un id desincronizado puede causar un choque
// de llave duplicada (E11000) al intentar agendar una cita nueva para ese
// mismo cliente en la fecha que el id "viejo" sigue reclamando.
//
// Por defecto corre en modo "dry run" (solo reporta qué haría, no escribe nada).
// Para aplicar los cambios de verdad: MIGRATE_CONFIRM=yes npm run migrate:citaids

const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';
const isDryRun = process.env.MIGRATE_CONFIRM !== 'yes';

// Solo interesan los ids que la propia app genera (DD-MM-YYYY-clienteId,
// ver guardarCitaNueva en AgendaContext.tsx). Otros esquemas de id (datos
// de seed/demo como "cita-1" o "reporte-test-...") nunca siguieron esta
// convención y no son corrupción: no deben tocarse.
const patronIdComposite = /^\d{2}-\d{2}-\d{4}-\d+$/;

const runMigration = async () => {
  try {
    await mongoose.connect(__dbUri);
    console.log(`Connected to MongoDB (${__dbUri})`);
    console.log(isDryRun ? 'Modo DRY RUN (no se escribirán cambios)\n' : 'Modo APLICAR CAMBIOS\n');

    const citas = await Cita.find().lean();
    // Snapshot mutable de qué cita ocupa cada id, para detectar colisiones
    // reales incluso cuando una corrección de esta misma corrida libera un
    // id que otra cita desincronizada necesita.
    const porId = new Map(citas.map((c) => [c.id, c]));

    const desincronizadas = citas.filter(
      (c) =>
        patronIdComposite.test(c.id) &&
        c.id !== `${c.fecha}-${c.clienteId}`,
    );

    if (desincronizadas.length === 0) {
      console.log('No hay citas con id desincronizado de su fecha. Nada que migrar.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Encontradas ${desincronizadas.length} citas con id desincronizado.\n`);

    let corregidas = 0;
    let enColision = 0;

    for (const cita of desincronizadas) {
      const idCorrecto = `${cita.fecha}-${cita.clienteId}`;
      const colision = porId.get(idCorrecto);

      if (colision) {
        enColision++;
        console.warn(
          `  [COLISIÓN] cita id="${cita.id}" (nombreCliente="${cita.nombreCliente}", fecha=${cita.fecha}) ` +
          `debería tener id="${idCorrecto}", pero ese id ya lo usa otra cita existente ` +
          `(nombreCliente="${colision.nombreCliente}", fecha=${colision.fecha}). No se puede corregir ` +
          `automáticamente sin fusionar servicios. Ábrela desde la app y vuelve a guardarla en su fecha ` +
          `correcta: la app ya fusiona citas del mismo cliente en el mismo día validando solapes de ` +
          `horario/estilista.`,
        );
        continue;
      }

      corregidas++;
      console.log(`  [OK] cita id="${cita.id}" -> id="${idCorrecto}"`);

      if (!isDryRun) {
        await Cita.updateOne({ id: cita.id }, { $set: { id: idCorrecto } });
      }
      porId.delete(cita.id);
      porId.set(idCorrecto, { ...cita, id: idCorrecto });
    }

    console.log(
      `\nResumen: ${corregidas} citas ${isDryRun ? 'se corregirían' : 'corregidas'}, ${enColision} en colisión (requieren revisión manual desde la app).`,
    );
    if (isDryRun && corregidas > 0) {
      console.log('Corre de nuevo con MIGRATE_CONFIRM=yes para aplicar estos cambios.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error migrando ids de citas:', error);
    process.exit(1);
  }
};

runMigration();
