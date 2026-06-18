export type Producto = {
    id: number;
    nombre: string;
    marca: string;
    precio: number | 0;
    descripcion?: string;
    stock: number | 0;
};

export type ProductoInCita = {
    id: number;
    nombre: string;
    precio: number | 0;
    cantidad: number | 0;
    total: number | 0;
    estilista: string;
}