import React, { useState } from "react";
import { Autocomplete, Box, TextField, Typography, CircularProgress } from "@mui/material";
import { Cliente } from "../../types/Cliente";
import { useThrottle } from "../../hooks/useThrottle";
import { searchClientesByNombre } from "../../services/clientesApi";

type Props = {
  name?: string;
  ctxValue?: string;
  dispatchContext?: (value: string) => void;
  onClienteSelect?: (cliente: Cliente | null) => void;
};

function ClienteInput({ name, ctxValue, dispatchContext, onClienteSelect }: Props) {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  const currentValue = ctxValue ?? value;

  const throttledSearch = useThrottle(async (query: string) => {
    if (!query.trim()) {
      setOptions([]);
      setLoading(false);
      return;
    }
    try {
      const results = await searchClientesByNombre(query);
      setOptions(results ?? []);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 100);

  const handleChange = (_: React.SyntheticEvent, newValue: Cliente | null) => {
    const nombre = newValue?.nombre ?? "";
    dispatchContext ? dispatchContext(nombre) : setValue(nombre);
    onClienteSelect?.(newValue);
  };

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    const clientValue = newInputValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    dispatchContext ? dispatchContext(clientValue) : setValue(clientValue);

    setLoading(true);
    throttledSearch(clientValue);
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.nombre}
      onChange={handleChange}
      inputValue={currentValue}
      onInputChange={handleInputChange}
      filterOptions={(opts) => opts} // La API filtra, no MUI
      noOptionsText={loading ? "Buscando..." : "Sin resultados"}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Box>
            <Typography variant="body1">{option.nombre}</Typography>
            {option.telefono && (
              <Typography variant="body2" color="text.secondary">
                {option.telefono}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          type="text"
          name={name}
          id="outlined-basic-client-input"
          label="Nombre del Cliente"
          variant="filled"
          // sx={{ width: "100%" }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      sx={{ width: "100%" }}
    />
  );
}

export default ClienteInput;