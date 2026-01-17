import Producto from "../types/Producto";

export type Cliente = {
  id: number;
  nombre: string;
  phone: string;
  correo: string;
  lastVisit: string;
};

export type Servicio = {
  rowIndex: number;
  cellID: string;
  estilista: string;
  servicio: string;
  precio: string;
  hora: string;
  duracion: number;
  estado: string;
  metododepago: string;
  notas: string;
};

export type Cita = {
  fecha: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicios: [] | Array<Servicio>;
};

export const globalData = {
  clientes: [
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
    {
      id: 4,
      nombre: "Eleazar Celis",
      phone: "3122105197",
      correo: "eleazar.celis@email.com",
      lastVisit: "14-01-2026",
    },
  ] as Array<Cliente>,
  serviciosDisponibles: [
    "Corte de cabello H",
    "Corte de cabello M",
    "Manicura",
    "Pedicura",
    "Coloración",
    "Peinado",
  ] as Array<string>,
  citas: [] as Array<Cita>,
  estilistas: [
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
  ],
  productos: [] as Array<Producto>,
};
