import React, { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { Cliente } from "../../types/Cliente";

type Props = {
  name?: string;
  ctxValue?: string;
  autoFocus?: boolean;
  ctxOptions: Cliente[];
  dispatchContext?: (value: string) => void;
  onSelectCliente?: (cliente: Cliente) => void;
};

function ClienteInput({
  name,
  ctxValue,
  dispatchContext,
  autoFocus,
  onSelectCliente,
  ctxOptions,
}: Props) {
  const options = useMemo(() => {
    const seen = new Set<number>();
    return ctxOptions.filter((cliente) => {
      if (seen.has(cliente.id)) return false;
      seen.add(cliente.id);
      return true;
    });
  }, [ctxOptions]);

  const [inputValue, setInputValue] = useState<string>(ctxValue || "");
  const [selectedOption, setSelectedOption] = useState<Cliente | string | null>(
    ctxValue || "",
  );

  // Evita el eco: cuando este componente dispara dispatchContext, el valor
  // vuelve por ctxValue y no debe disparar otra vez setInputValue,
  // solo re-sincronizamos si el cambio vino de fuera (otro campo/selección).
  const lastDispatched = useRef(ctxValue || "");

  useEffect(() => {
    if ((ctxValue || "") === lastDispatched.current) return;
    lastDispatched.current = ctxValue || "";
    setInputValue(ctxValue || "");
  }, [ctxValue]);

  const handleAutocompleteChange = (
    _event: React.SyntheticEvent,
    newValue: Cliente | string | null,
  ) => {
    if (typeof newValue === "string") {
      setSelectedOption(newValue);
      dispatchContext?.(newValue);
      return;
    }

    if (newValue) {
      setSelectedOption(newValue);
      dispatchContext?.(newValue.nombre);
      onSelectCliente?.(newValue);
      return;
    }

    setSelectedOption(null);
  };

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    lastDispatched.current = newInputValue;
    setInputValue(newInputValue);
    dispatchContext?.(newInputValue);
  };

  return (
    <Autocomplete<Cliente, false, false, true>
      freeSolo
      openOnFocus
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.nombre
      }
      isOptionEqualToValue={(option, val) =>
        typeof val === "string" ? option.nombre === val : option.id === val.id
      }
      getOptionKey={(option) =>
        typeof option === "string" ? option : option.id
      }
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      onChange={handleAutocompleteChange}
      onInputChange={handleInputChange}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          type="text"
          name={name}
          id="outlined-basic-client-input"
          label="Nombre del Cliente"
          variant="filled"
          sx={{ width: "100%" }}
          autoFocus={autoFocus}
        />
      )}
      renderOption={(props, option) => {
        const cliente =
          typeof option === "string"
            ? { nombre: option, telefono: "" }
            : option;
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={key} {...optionProps}>
            {cliente.telefono
              ? `${cliente.nombre} — ${cliente.telefono}`
              : cliente.nombre}
          </Box>
        );
      }}
    />
  );
}

export default ClienteInput;
