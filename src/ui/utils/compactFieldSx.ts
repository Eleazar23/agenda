export const COMPACT_FIELD_HEIGHT = 40;

// Campo compacto con borde fino y fondo claro (variant "outlined", sin label
// flotante: la etiqueta va arriba con <FieldLabel>).
export const compactFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: COMPACT_FIELD_HEIGHT,
    borderRadius: 2,
    bgcolor: "#fafafa",
    fontSize: 14,
    "& fieldset": { borderColor: "#e3e5e8" },
  },
};
