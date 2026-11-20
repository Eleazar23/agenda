import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, SxProps, Theme } from "@mui/material";
import { Producto } from "../../types/Producto";
import { formatMoney } from "../../utils/utils";

type Props = {
  serviceIndex?: number;
  value: Producto | null;
  onChange: (newValue: Producto | null) => void;
  variant?: "filled" | "outlined" | "standard";
  size?: "small" | "medium";
  hideLabel?: boolean;
  sx?: SxProps<Theme>;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function ProductInput({
  value,
  onChange,
  variant = "filled",
  size,
  hideLabel,
  sx,
}: Props) {
  // const { servicios } = useAgendaContext();
  const [options, setOptions] = React.useState<Array<Producto>>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: Producto | null,
  ) => {
    event.preventDefault();
    if (newValue) {
      onChange(newValue);
    }
  };

  const getProductos = async () => {
    try {
      const productos = await window.api.getProductos();
      setOptions(productos);
      return productos;
    } catch (error) {
      console.error("Error loading productos:", error);
      return [];
    }
  };

  React.useEffect(() => {
    getProductos();
  }, []);

  return (
    <Autocomplete<Producto>
      getOptionLabel={(option) => option.nombre}
      options={options}
      fullWidth
      size={size}
      sx={sx}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={styles.textField}
          label={hideLabel ? undefined : "Producto"}
          placeholder={hideLabel ? "Buscar producto…" : undefined}
          variant={variant}
        />
      )}
      onChange={handleChange}
      // Se recarga al abrir para mostrar el stock actual: la venta de
      // productos lo descuenta en BD al momento.
      onOpen={getProductos}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={`${option.id}-${option.nombre}`} {...optionProps}>
            {`${option.nombre} - ${formatMoney(option.precio)} | Stock: ${option.stock}`}
          </Box>
        );
      }}
    />
  );
}
