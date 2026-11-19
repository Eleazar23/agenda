export const estadoCitaColors: Record<string, { color: string; bg: string }> = {
  "sin confirmar": { color: "#92610b", bg: "#fff4df" },
  confirmado: { color: "#0d5ab8", bg: "#e7f1fe" },
  "en proceso": { color: "#0d5ab8", bg: "#e7f1fe" },
  pagado: { color: "#1e7d34", bg: "#e6f6ea" },
  finalizado: { color: "#1e7d34", bg: "#e6f6ea" },
  cancelado: { color: "#b3261e", bg: "#fdeceb" },
  "no asistio": { color: "#b3261e", bg: "#fdeceb" },
};

export const getEstadoCitaColor = (estado?: string) =>
  estadoCitaColors[estado || ""] || { color: "#5b6069", bg: "#eef1f6" };
