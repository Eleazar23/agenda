import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/agenda');
    console.log('Connected to MongoDB for seeding...');

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
        phone: "5551234567",
        correo: "juan.perez@email.com",
        lastVisit: "10-01-2026",
      },
      {
        id: 2,
        nombre: "Maria Lopez",
        phone: "5559876543",
        correo: "maria.lopez@email.com",
        lastVisit: "12-01-2026",
      },
      {
        id: 3,
        nombre: "Carlos Sanchez",
        phone: "5554567890",
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
        phone: "5551112222",
      },
      {
        id: 2,
        name: "felix",
        displayName: "Felix",
        phone: "5553334444",
      },
      {
        id: 3,
        name: "magi",
        displayName: "Magi",
        phone: "5555556666",
      },
      {
        id: 4,
        name: "arturo",
        displayName: "Arturo",
        phone: "5557778888",
      },
      {
        id: 5,
        name: "mimi",
        displayName: "Mimi",
        phone: "5559990000",
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
