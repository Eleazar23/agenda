export type Gasto = {
  id: number;
  proveedorNombre: string;
  monto: number;
  fecha: string; // DD-MM-YYYY format
  categoria: string;
  descripcion: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
};
