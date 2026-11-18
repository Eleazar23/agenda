export type Vacacion = {
  inicio: string;
  fin: string;
};

export type Estilista = {
  id: number;
  name: string;
  telefono: string;
  displayName?: string;
  role: string;
  vacaciones?: Vacacion[];
};
