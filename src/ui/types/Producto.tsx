export type Producto = {
    id: number;
    nombre: string;
    marca: string;
    precio: string;
    descripcion?: string;
    stock: number | 0;
};