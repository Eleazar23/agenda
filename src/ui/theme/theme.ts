import { createTheme } from "@mui/material/styles";

export type CitaStatusKey =
  | "sin confirmar"
  | "confirmado"
  | "en proceso"
  | "finalizado"
  | "pagado"
  | "no asistio"
  | "cancelado";

export type AgendaCitaColors = {
  bg: string;
  border: string;
  name: string;
  text: string;
  chipBg: string;
  chipText: string;
};

export type BloqueoKey = "comida" | "vacaciones" | "feriado";

export type AgendaBloqueoColors = {
  bg: string;
  chipBg: string;
  chipText: string;
  icon: string;
};

export type AgendaPalette = {
  citas: Record<CitaStatusKey, AgendaCitaColors>;
  bloqueos: Record<BloqueoKey, AgendaBloqueoColors>;
  emptyCell: { dash: string };
  oddRow: string;
};

declare module "@mui/material/styles" {
  interface Palette {
    agenda: AgendaPalette;
  }
  interface PaletteOptions {
    agenda?: AgendaPalette;
  }
}

const agendaPalette: AgendaPalette = {
  citas: {
    "sin confirmar": {
      bg: "#FFF4E0",
      border: "#E08A00",
      name: "#5C3A00",
      text: "#7A4E06",
      chipBg: "#FBDDA8",
      chipText: "#5C3A00",
    },
    confirmado: {
      bg: "#E3EEFB",
      border: "#1976D2",
      name: "#0D3C73",
      text: "#2B5A8F",
      chipBg: "#C5DAF5",
      chipText: "#0D3C73",
    },
    "en proceso": {
      bg: "#EFE7FB",
      border: "#7C3AED",
      name: "#3B1A78",
      text: "#5B2DB0",
      chipBg: "#DCCBF7",
      chipText: "#3B1A78",
    },
    finalizado: {
      bg: "#E0F2F1",
      border: "#0F8A80",
      name: "#0B4F4A",
      text: "#11665F",
      chipBg: "#BFE5E1",
      chipText: "#0B4F4A",
    },
    pagado: {
      bg: "#2E7D32",
      border: "#1B5E20",
      name: "#FFFFFF",
      text: "#E3F2E4",
      chipBg: "#FFFFFF",
      chipText: "#1B5E20",
    },
    "no asistio": {
      bg: "#FBEDED",
      border: "#D64545",
      name: "#7A1F1F",
      text: "#8F3434",
      chipBg: "#F5CFCF",
      chipText: "#7A1F1F",
    },
    // No especificado en el diseño original; se conserva la paleta roja que
    // ya usaba la app para "cancelado", reestructurada al nuevo esquema
    // bg/border/name/text/chipBg/chipText.
    cancelado: {
      bg: "#FFEBEE",
      border: "#C62828",
      name: "#B71C1C",
      text: "#B71C1C",
      chipBg: "#FFCDD2",
      chipText: "#B71C1C",
    },
  },
  bloqueos: {
    comida: {
      bg: "#ECEFF3",
      chipBg: "#FFFFFF",
      chipText: "#475569",
      icon: "🍽",
    },
    vacaciones: {
      bg: "#F1EDE8",
      chipBg: "#FFFFFF",
      chipText: "#6B5B4B",
      icon: "🏖",
    },
    // No especificado en el diseño original; se propone el mismo estilo de
    // "comida" (como se indicó) con un ícono de calendario para diferenciarlo.
    feriado: {
      bg: "#ECEFF3",
      chipBg: "#FFFFFF",
      chipText: "#475569",
      icon: "📅",
    },
  },
  emptyCell: {
    dash: "#C4C9D1",
  },
  oddRow: "#F7F8FA",
};

export const theme = createTheme({
  palette: {
    agenda: agendaPalette,
  },
});
