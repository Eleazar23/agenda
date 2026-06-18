type Options = {
    id: string;
    label: string;
    value: string;
}
// "sin confirmar","confirmado", "en proceso", "pagado", "cancelado", "no asistio", "finalizado"
export const statusCitaOptions: Options[] = [
    { id: "1", label: "Sin Confirmar", value: "sin confirmar" },
    { id: "2", label: "Confirmado", value: "confirmado" },
    { id: "3", label: "En Proceso", value: "en proceso" },
    { id: "4", label: "Pagado", value: "pagado" },
    { id: "5", label: "Cancelado", value: "cancelado" },
    { id: "6", label: "No Asistió", value: "no asistio" },
    { id: "7", label: "Finalizado", value: "finalizado" },
]