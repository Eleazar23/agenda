import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/material";
import { Producto } from "../../types/Producto";

type Props = {
  serviceIndex?: number;
  value: Producto | null;
  onChange: (newValue: Producto | null) => void;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function ProductInput({ value, onChange }: Props) {
  // const { servicios } = useAgendaContext();
  const [options, setOptions] = React.useState<Array<Producto>>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: Producto | null,
  ) => {
    event.preventDefault();
    console.log("Selected product:", newValue);
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
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={styles.textField}
          label="Producto"
          variant="filled"
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
            {`${option.nombre} - $${option.precio} | Stock: ${option.stock}`}
          </Box>
        );
      }}
    />
  );
}
