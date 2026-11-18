import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Cita } from './models/Cita.js';

// Rellena el campo clienteId en citas guardadas antes de que existiera ese campo,
// buscando el Cliente correspondiente por nombre + teléfono.
//
// Por defecto corre en modo "dry run" (solo reporta qué haría, no escribe nada).
// Para aplicar los cambios de verdad: MIGRATE_CONFIRM=yes npm run migrate:clienteid

const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';
const isDryRun = process.env.MIGRATE_CONFIRM !== 'yes';

const runMigration = async () => {
  try {
    await mongoose.connect(__dbUri);
    console.log(`Connected to MongoDB (${__dbUri})`);
    console.log(isDryRun ? 'Modo DRY RUN (no se escribirán cambios)\n' : 'Modo APLICAR CAMBIOS\n');

    const citasSinClienteId = await Cita.find({
      $or: [{ clienteId: { $exists: false } }, { clienteId: null }],
    }).lean();

    if (citasSinClienteId.length === 0) {
      console.log('No hay citas sin clienteId. Nada que migrar.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Encontradas ${citasSinClienteId.length} citas sin clienteId.\n`);

    let matched = 0;
    let unmatched = 0;

    for (const cita of citasSinClienteId) {
      const cliente = await Cliente.findOne({
        nombre: cita.nombreCliente,
        telefono: cita.telefonoCliente,
      })
        .collation({ locale: 'en', strength: 2 })
        .lean();

      if (!cliente) {
        unmatched++;
        console.warn(
          `  [SIN MATCH] cita id="${cita.id}" fecha=${cita.fecha} nombreCliente="${cita.nombreCliente}" ` +
          `telefonoCliente="${cita.telefonoCliente}" — no se encontró un Cliente con ese nombre y teléfono. ` +
          `Créalo manualmente y vuelve a correr este script.`,
        );
        continue;
      }

      matched++;
      console.log(
        `  [OK] cita id="${cita.id}" -> clienteId=${cliente.id} (${cliente.nombre})`,
      );

      if (!isDryRun) {
        await Cita.updateOne({ id: cita.id }, { $set: { clienteId: cliente.id } });
      }
    }

    console.log(
      `\nResumen: ${matched} citas ${isDryRun ? 'se actualizarían' : 'actualizadas'}, ${unmatched} sin match.`,
    );
    if (isDryRun && matched > 0) {
      console.log('Corre de nuevo con MIGRATE_CONFIRM=yes para aplicar estos cambios.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error migrando clienteId:', error);
    process.exit(1);
  }
};

runMigration();
