import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Servicio } from "../../types/Servicio";
import { Box, SxProps, Theme } from "@mui/material";

type Props = {
  serviceIndex?: number;
  value: Servicio | null;
  onChange: (newValue: Servicio | null) => void;
  size?: "small" | "medium";
  id?: string;
  error?: boolean;
  helperText?: string;
  variant?: "filled" | "outlined" | "standard";
  hideLabel?: boolean;
  sx?: SxProps<Theme>;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

// const options = [ // fix when mongo db working
//   "Corte de Cabello H",
//   "Corte de Cabello M",
//   "Tinte",
//   "Peinado",
// ];

export default function ServiciosInput({
  value,
  onChange,
  size,
  id,
  error,
  helperText,
  variant = "filled",
  hideLabel,
  sx,
}: Props) {
  // const { servicios } = useAgendaContext();
  const [options, setOptions] = React.useState<Array<Servicio>>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: Servicio | null,
  ) => {
    event.preventDefault();
    if (newValue) {
      onChange(newValue);
    }
  };

  const getServicios = async () => {
    try {
      const servicios = await window.api.getServicios();
      setOptions(servicios);
      return servicios;
    } catch (error) {
      console.error("Error loading servicios:", error);
      return [];
    }
  };

  React.useEffect(() => {
    getServicios();
  }, []);

  return (
    <Autocomplete<Servicio>
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
          label={hideLabel ? undefined : "Servicio"}
          variant={variant}
          size={size}
          error={error}
          helperText={helperText}
          slotProps={{
            htmlInput: { ...params.inputProps, id: id || params.inputProps?.id },
          }}
        />
      )}
      onChange={handleChange}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={`${option.id}-${option.nombre}`} {...optionProps}>
            {option.nombre} - ${option.precio}
          </Box>
        );
      }}
    />
  );
}
