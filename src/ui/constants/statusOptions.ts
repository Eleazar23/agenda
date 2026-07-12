export type StatusCitaOption = {
  id: string;
  label: string;
  value: string;
};

export const statusOptions: StatusCitaOption[] = [
  { id: "1", label: "Sin Confirmar", value: "sin confirmar" },
  { id: "2", label: "Confirmado", value: "confirmado" },
  { id: "3", label: "En Proceso", value: "en proceso" },
  { id: "4", label: "Pagado", value: "pagado" },
  { id: "5", label: "Finalizado", value: "finalizado" },
  { id: "6", label: "No Asistió", value: "no asistio" },
  { id: "7", label: "Cancelado", value: "cancelado" },
];
