import { themeQuartz } from "ag-grid-community";
import { theme as muiTheme } from "./theme";

// Tema de ag-grid alineado a la paleta azul de MUI (theme.ts), en vez del
// Quartz gris por defecto, para que las 12 tablas de la app no choquen
// visualmente con el resto de los componentes.
export const agGridTheme = themeQuartz.withParams({
  accentColor: muiTheme.palette.primary.main,
  headerBackgroundColor: muiTheme.palette.background.default,
  headerTextColor: muiTheme.palette.text.primary,
  borderRadius: muiTheme.shape.borderRadius,
  wrapperBorderRadius: muiTheme.shape.borderRadius,
  fontFamily: muiTheme.typography.fontFamily,
  rowHoverColor: muiTheme.palette.action.hover,
});
