import mongoose from 'mongoose';
import { Cliente } from './models/Cliente.js';
import { Estilista } from './models/Estilista.js';
import { Servicio } from './models/Servicio.js';
import { Producto } from './models/Producto.js';
import { Cita } from './models/Cita.js';
import { Gasto } from './models/Gasto.js';

const __dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda';

// Fecha objetivo para las citas/gastos de prueba (DD-MM-YYYY).
// Por defecto usa el día de hoy para que el módulo de Reportes
// (que ahora filtra por la fecha actual al entrar) muestre datos de inmediato.
const targetDate =
  process.env.SEED_FECHA ||
  new Intl.DateTimeFormat('en-GB').format(new Date()); // DD/MM/YYYY -> se normaliza abajo

const fecha = targetDate.includes('/')
  ? targetDate.split('/').join('-')
  : targetDate;

const seedReportesData = async () => {
  try {
    await mongoose.connect(__dbUri);
    console.log(`Connected to MongoDB for seeding reportes de prueba... (${__dbUri})`);
    console.log(`Fecha objetivo: ${fecha}`);

    // Este seed NO borra nada, solo agrega citas pagadas y gastos de prueba
    // para poder ver datos en el módulo de Reportes.

    const [clientes, estilistas, servicios, productos] = await Promise.all([
      Cliente.find().lean(),
      Estilista.find().lean(),
      Servicio.find().lean(),
      Producto.find().lean(),
    ]);

    if (!clientes.length || !estilistas.length || !servicios.length) {
      console.error(
        '\nFaltan datos base (clientes, estilistas o servicios). ' +
        'Corre primero "npm run seed:db" para tener catálogos, ' +
        'o crea al menos un cliente, estilista y servicio desde la app.\n',
      );
      await mongoose.connection.close();
      process.exit(1);
    }

    const cliente1 = clientes[0];
    const cliente2 = clientes[1] || clientes[0];
    const estilista1 = estilistas[0];
    const estilista2 = estilistas[1] || estilistas[0];
    const servicio1 = servicios[0];
    const servicio2 = servicios[1] || servicios[0];
    const producto1 = productos[0];
    const producto2 = productos[1] || productos[0];

    const runId = Date.now();

    const citasAInsertar = [
      {
        id: `reporte-test-${runId}-1`,
        clienteId: cliente1.id,
        fecha,
        nombreCliente: cliente1.nombre,
        telefonoCliente: cliente1.telefono,
        servicios: [
          {
            rowIndex: 0,
            cellID: `reporte-test-${runId}-1-servicio-1`,
            servicio: { id: servicio1.id, nombre: servicio1.nombre, precio: servicio1.precio },
            estilista: estilista1.displayName,
            horaInicio: '10:00',
            horaFin: '10:30',
            duracion: 30,
            fecha,
          },
        ],
        productos: producto1
          ? [
              {
                id: producto1.id,
                nombre: producto1.nombre,
                estilista: estilista1.displayName,
                precio: producto1.precio,
                cantidad: 2,
              },
            ]
          : [],
        estado: 'pagado',
        metodoDePago: 'Efectivo',
        notas: 'Cita de prueba para reportes',
      },
      {
        id: `reporte-test-${runId}-2`,
        clienteId: cliente2.id,
        fecha,
        nombreCliente: cliente2.nombre,
        telefonoCliente: cliente2.telefono,
        servicios: [
          {
            rowIndex: 0,
            cellID: `reporte-test-${runId}-2-servicio-1`,
            servicio: { id: servicio2.id, nombre: servicio2.nombre, precio: servicio2.precio },
            estilista: estilista2.displayName,
            horaInicio: '12:00',
            horaFin: '12:45',
            duracion: 45,
            fecha,
          },
        ],
        productos: producto2
          ? [
              {
                id: producto2.id,
                nombre: producto2.nombre,
                estilista: estilista2.displayName,
                precio: producto2.precio,
                cantidad: 1,
              },
            ]
          : [],
        estado: 'pagado',
        metodoDePago: 'Tarjeta',
        notas: 'Cita de prueba para reportes',
      },
      {
        id: `reporte-test-${runId}-3`,
        clienteId: cliente1.id,
        fecha,
        nombreCliente: cliente1.nombre,
        telefonoCliente: cliente1.telefono,
        servicios: [
          {
            rowIndex: 0,
            cellID: `reporte-test-${runId}-3-servicio-1`,
            servicio: { id: servicio1.id, nombre: servicio1.nombre, precio: servicio1.precio },
            estilista: estilista2.displayName,
            horaInicio: '15:00',
            horaFin: '15:30',
            duracion: 30,
            fecha,
          },
        ],
        productos: [],
        // No pagada: sirve para confirmar que Reportes solo cuenta citas "pagado"
        estado: 'completada',
        metodoDePago: 'Efectivo',
        notas: 'Cita de prueba (no pagada) para reportes',
      },
    ];

    const citas = await Cita.insertMany(citasAInsertar);
    console.log(`Seeded ${citas.length} citas de prueba (2 pagadas, 1 sin pagar) para ${fecha}`);

    const maxGasto = await Gasto.findOne().sort('-id').lean();
    const nextGastoId = maxGasto ? maxGasto.id + 1 : 1;

    const gastosAInsertar = [
      {
        id: nextGastoId,
        proveedorNombre: 'Proveedor de Prueba SA',
        monto: 350,
        fecha,
        categoria: 'Insumos',
        descripcion: 'Compra de insumos de prueba para reportes',
        metodoPago: 'efectivo' as const,
      },
      {
        id: nextGastoId + 1,
        proveedorNombre: 'Servicios Generales',
        monto: 120.5,
        fecha,
        categoria: 'Servicios',
        descripcion: 'Pago de servicios de prueba para reportes',
        metodoPago: 'transferencia' as const,
      },
    ];

    const gastos = await Gasto.insertMany(gastosAInsertar);
    console.log(`Seeded ${gastos.length} gastos de prueba para ${fecha}`);

    console.log('\nListo. Abre el módulo de Reportes y filtra por la fecha', fecha);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reportes de prueba:', error);
    process.exit(1);
  }
};

seedReportesData();
