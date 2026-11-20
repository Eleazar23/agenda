import mongoose from 'mongoose';
import { normalizarNombres } from './normalizeNombres.js';

// Quita espacios en blanco al inicio/final del nombre de clientes, estilistas,
// productos y servicios ya guardados en la BD (de antes de que el schema
// tuviera trim: true), para que el ordenamiento alfabético quede correcto.
//
// Esto también corre automáticamente cada vez que arranca la app (ver
// normalizarNombres() en main.ts), así que este script manual es solo para
// revisar/forzar la limpieza sin tener que abrir la app.
//
// Por defecto corre en modo "dry run" (solo reporta qué haría, no escribe nada).
// Para aplicar los cambios de verdad: MIGRATE_CONFIRM=yes npm run migrate:trimnombres

const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';
const isDryRun = process.env.MIGRATE_CONFIRM !== 'yes';

const runMigration = async () => {
  try {
    await mongoose.connect(__dbUri);
    console.log(`Connected to MongoDB (${__dbUri})`);
    console.log(isDryRun ? 'Modo DRY RUN (no se escribirán cambios)\n' : 'Modo APLICAR CAMBIOS\n');

    const resultados = await normalizarNombres(!isDryRun);

    let total = 0;
    for (const { etiqueta, corregidos } of resultados) {
      if (corregidos.length === 0) {
        console.log(`${etiqueta}: sin nombres con espacios de más.`);
        continue;
      }
      total += corregidos.length;
      console.log(`${etiqueta}: ${corregidos.length} con espacios de más.`);
      for (const { id, antes, despues } of corregidos) {
        console.log(`  id=${id} "${antes}" -> "${despues}"`);
      }
    }

    if (total === 0) {
      console.log('\nNada que migrar.');
    } else if (isDryRun) {
      console.log(`\n${total} documento(s) serían corregidos. Vuelve a correr con MIGRATE_CONFIRM=yes para aplicar.`);
    } else {
      console.log(`\n${total} documento(s) corregidos.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error corriendo la migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runMigration();
