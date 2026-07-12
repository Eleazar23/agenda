import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';

const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(__dbUri);
    console.log(`Connected to MongoDB for seeding... (${__dbUri})`);

    // Este script BORRA todos los clientes, estilistas, servicios y productos
    // existentes antes de sembrar datos de prueba. Es solo para desarrollo:
    // exige confirmación explícita para evitar destruir datos reales por accidente.
    if (process.env.SEED_CONFIRM !== 'yes') {
      console.error(
        '\nABORTADO: este script borra todos los clientes, estilistas, servicios y productos ' +
        `de la base "${__dbUri}" antes de sembrar datos de prueba.\n` +
        'Si estás seguro de que quieres hacer esto (normalmente solo en desarrollo), ' +
        'vuelve a correrlo con la variable de entorno SEED_CONFIRM=yes.\n',
      );
      await mongoose.connection.close();
      process.exit(1);
    }

    // Clear existing data
    await Promise.all([
      Cliente.deleteMany({}),
      Estilista.deleteMany({}),
      Servicio.deleteMany({}),
      Producto.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Seed Clientes
    const clientes = await Cliente.insertMany([
      {
        id: 1,
        nombre: "Juan Perez",
        telefono: "5551234567",
        correo: "juan.perez@email.com",
        lastVisit: "10-01-2026",
      },
      {
        id: 2,
        nombre: "Maria Lopez",
        telefono: "5559876543",
        correo: "maria.lopez@email.com",
        lastVisit: "12-01-2026",
      },
      {
        id: 3,
        nombre: "Carlos Sanchez",
        telefono: "5554567890",
        correo: "carlos.sanchez@email.com",
        lastVisit: "08-01-2026",
      },
    ]);
    console.log(`Seeded ${clientes.length} clientes`);

    // Seed Servicios
    const servicios = await Servicio.insertMany([
      { id: 1, nombre: "Corte de cabello H", precio: "150" },
      { id: 2, nombre: "Corte de cabello M", precio: "120" },
      { id: 3, nombre: "Manicura", precio: "80" },
      { id: 4, nombre: "Pedicura", precio: "100" },
      { id: 5, nombre: "Coloración", precio: "200" },
      { id: 6, nombre: "Peinado", precio: "90" },
    ]);
    console.log(`Seeded ${servicios.length} servicios`);

    // Seed Estilistas
    const estilistas = await Estilista.insertMany([
      {
        id: 1,
        name: "tomi",
        displayName: "Tomi",
        telefono: "5551112222",
      },
      {
        id: 2,
        name: "felix",
        displayName: "Felix",
        telefono: "5553334444",
      },
      {
        id: 3,
        name: "magi",
        displayName: "Magi",
        telefono: "5555556666",
      },
      {
        id: 4,
        name: "arturo",
        displayName: "Arturo",
        telefono: "5557778888",
      },
      {
        id: 5,
        name: "mimi",
        displayName: "Mimi",
        telefono: "5559990000",
        role: "vendedor",
      },
    ]);
    console.log(`Seeded ${estilistas.length} estilistas`);

    // Seed Productos
    const productos = await Producto.insertMany([
      { id: 1, nombre: "Shampoo", marca: "L'Oreal", precio: "50" },
      { id: 2, nombre: "Acondicionador", marca: "Pantene", precio: "60" },
      { id: 3, nombre: "Gel para cabello", marca: "Schwarzkopf", precio: "40" },
      { id: 4, nombre: "Cera para cabello", marca: "Redken", precio: "70" },
      { id: 5, nombre: "Laca para cabello", marca: "TRESemmé", precio: "80" },
    ]);
    console.log(`Seeded ${productos.length} productos`);

    console.log('Database seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
