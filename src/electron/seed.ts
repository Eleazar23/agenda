import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';
import { Cita } from './models/Cita.js';

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
      Cita.deleteMany({}),
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

    // Seed Citas (para probar la bitácora de historial de clientes)
    const citas = await Cita.insertMany([
      {
        id: "cita-1",
        clienteId: 1,
        fecha: "10-01-2026",
        nombreCliente: "Juan Perez",
        telefonoCliente: "5551234567",
        servicios: [
          {
            rowIndex: 0,
            cellID: "cita-1-servicio-1",
            servicio: { id: 1, nombre: "Corte de cabello H", precio: "150" },
            estilista: "Tomi",
            horaInicio: "10:00",
            horaFin: "10:30",
            duracion: 30,
            fecha: "10-01-2026",
          },
        ],
        productos: [],
        estado: "completada",
        metodoDePago: "Efectivo",
        notas: "Cliente pidió corte más corto de los lados.",
      },
      {
        id: "cita-2",
        clienteId: 1,
        fecha: "24-01-2026",
        nombreCliente: "Juan Perez",
        telefonoCliente: "5551234567",
        servicios: [
          {
            rowIndex: 0,
            cellID: "cita-2-servicio-1",
            servicio: { id: 5, nombre: "Coloración", precio: "200" },
            estilista: "Felix",
            horaInicio: "11:00",
            horaFin: "12:30",
            duracion: 90,
            fecha: "24-01-2026",
          },
          {
            rowIndex: 1,
            cellID: "cita-2-servicio-2",
            servicio: { id: 6, nombre: "Peinado", precio: "90" },
            estilista: "Felix",
            horaInicio: "12:30",
            horaFin: "13:00",
            duracion: 30,
            fecha: "24-01-2026",
          },
        ],
        productos: [],
        estado: "pagado",
        metodoDePago: "Tarjeta",
        notas: "",
      },
      {
        id: "cita-3",
        clienteId: 1,
        fecha: "02-02-2026",
        nombreCliente: "Juan Perez",
        telefonoCliente: "5551234567",
        servicios: [
          {
            rowIndex: 0,
            cellID: "cita-3-servicio-1",
            servicio: { id: 1, nombre: "Corte de cabello H", precio: "150" },
            estilista: "Tomi",
            horaInicio: "09:00",
            horaFin: "09:30",
            duracion: 30,
            fecha: "02-02-2026",
          },
        ],
        productos: [],
        estado: "no asistio",
        metodoDePago: "",
        notas: "Cliente no llegó a la cita.",
      },
      {
        id: "cita-4",
        clienteId: 1,
        fecha: "15-02-2026",
        nombreCliente: "Juan Perez",
        telefonoCliente: "5551234567",
        servicios: [
          {
            rowIndex: 0,
            cellID: "cita-4-servicio-1",
            servicio: { id: 3, nombre: "Manicura", precio: "80" },
            estilista: "Magi",
            horaInicio: "16:00",
            horaFin: "16:45",
            duracion: 45,
            fecha: "15-02-2026",
          },
        ],
        productos: [],
        estado: "cancelado",
        metodoDePago: "",
        notas: "Canceló por trabajo.",
      },
      {
        id: "cita-5",
        clienteId: 2,
        fecha: "12-01-2026",
        nombreCliente: "Maria Lopez",
        telefonoCliente: "5559876543",
        servicios: [
          {
            rowIndex: 0,
            cellID: "cita-5-servicio-1",
            servicio: { id: 4, nombre: "Pedicura", precio: "100" },
            estilista: "Arturo",
            horaInicio: "14:00",
            horaFin: "14:45",
            duracion: 45,
            fecha: "12-01-2026",
          },
        ],
        productos: [],
        estado: "completada",
        metodoDePago: "Efectivo",
        notas: "",
      },
    ]);
    console.log(`Seeded ${citas.length} citas`);

    console.log('Database seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
