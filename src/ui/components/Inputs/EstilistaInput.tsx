import * as React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  SxProps,
  Theme,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";
import { Estilista } from "../../types/Estilista";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName:string, value: string) => void;
  readOnly?: boolean;
  variant?: "filled" | "outlined" | "standard";
  // Para servicios: solo el rol "estilista", que es el que tiene columna en
  // la agenda. Los vendedores sí aplican al vender productos.
  soloEstilistas?: boolean;
  // Por defecto, si no hay ctxValue se autoselecciona el primero de la
  // lista (necesario para un servicio, que siempre necesita un estilista
  // asignado). En false queda vacío hasta que el usuario elija.
  autoSelectFirst?: boolean;
  size?: "small" | "medium";
  // Sin label flotante: el padre muestra su propia etiqueta arriba.
  hideLabel?: boolean;
  sx?: SxProps<Theme>;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function EstilistaInput({
  ctxValue,
  ctxDispatch,
  readOnly,
  variant,
  soloEstilistas,
  autoSelectFirst = true,
  size,
  hideLabel,
  sx,
}: Props) {
  const [estilistas, setEstilistas] = React.useState<Estilista[]>([]);
  const [selected, setSelected] = React.useState<string>("");

  React.useEffect(() => {
    const fetchEstilistas = async () => {
      try {
        const data = await window.api.getEstilistas();
        setEstilistas(
          soloEstilistas
            ? data.filter((estilista) => estilista.role === "estilista")
            : data,
        );
      } catch (error) {
        console.error("Error fetching estilistas:", error);
      }
    };
    fetchEstilistas();
  }, [soloEstilistas]);

  React.useEffect(() => {
    if (ctxValue) {
      setSelected(ctxValue);
      return;
    }
    if (!autoSelectFirst) {
      setSelected("");
      return;
    }
    if (estilistas.length > 0) {
      const defaultValue = estilistas[0].name;
      setSelected(defaultValue);
      ctxDispatch?.("estilista", defaultValue);
    }
  }, [ctxValue, estilistas, ctxDispatch, autoSelectFirst]);

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setSelected(newValue);
    if (ctxDispatch) {
      ctxDispatch("estilista", newValue);
    }
  };

  return (
    <FormControl variant={variant || "filled"} fullWidth size={size} sx={sx}>
      {!hideLabel && <InputLabel id="demo-select-label">Estilista</InputLabel>}
      <Select
        labelId={hideLabel ? undefined : "demo-select-label"}
        id="demo-select"
        value={selected}
        label={hideLabel ? undefined : "Estilista"}
        onChange={handleChange}
        sx={styles.textField}
        inputProps={{ readOnly: readOnly, "aria-label": "Estilista" }}
        displayEmpty={!autoSelectFirst}
        renderValue={
          autoSelectFirst
            ? undefined
            : (value) =>
                value ? (
                  capitalizeFirstLetter(value)
                ) : (
                  <Box
                    component="span"
                    sx={{ color: "text.disabled", textTransform: "none" }}
                  >
                    Selecciona un estilista
                  </Box>
                )
        }
      >
        {estilistas.map((estilista) => (
          <MenuItem key={estilista.id} value={estilista.name}>
            {capitalizeFirstLetter(estilista.name)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
