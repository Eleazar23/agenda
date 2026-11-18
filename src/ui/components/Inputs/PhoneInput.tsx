import React, { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Cliente } from "../../types/Cliente";

type Props = {
  valueContext?: string;
  dispatchContext?: (value: string) => void;
  searchIcon?: boolean;
  variant?: "filled" | "outlined" | "standard";
  handleSearch?: (value: string) => void;
  autoFocus?: boolean;
  ctxOptions?: Cliente[];
  onSelectCliente?: (cliente: Cliente) => void;
};

const sanitizePhone = (raw: string) => raw.replace(/[^0-9]/g, "");

function PhoneInput({
  valueContext,
  dispatchContext,
  searchIcon = true,
  variant,
  handleSearch,
  autoFocus,
  ctxOptions,
  onSelectCliente,
}: Props) {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState<string>(valueContext || "");
  const [selectedOption, setSelectedOption] = useState<Cliente | string | null>(
    valueContext || "",
  );

  const options = useMemo(() => {
    if (!ctxOptions) return [];
    const seen = new Set<number>();
    return ctxOptions.filter((cliente) => {
      if (!cliente.telefono || seen.has(cliente.id)) return false;
      seen.add(cliente.id);
      return true;
    });
  }, [ctxOptions]);

  // Evita el eco: cuando este componente dispara dispatchContext, el valor
  // vuelve por valueContext y no debe disparar otra vez setInputValue,
  // solo re-sincronizamos si el cambio vino de fuera (otro campo/selección).
  const lastDispatched = useRef(valueContext || "");

  useEffect(() => {
    if ((valueContext || "") === lastDispatched.current) return;
    lastDispatched.current = valueContext || "";
    setInputValue(valueContext || "");
  }, [valueContext]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numericValue = sanitizePhone(newValue);
    dispatchContext ? dispatchContext(numericValue) : setValue(numericValue);
  };

  const handleAutocompleteChange = (
    _event: React.SyntheticEvent,
    newValue: Cliente | string | null,
  ) => {
    if (typeof newValue === "string") {
      const numericValue = sanitizePhone(newValue);
      setSelectedOption(numericValue);
      dispatchContext?.(numericValue);
      return;
    }

    if (newValue) {
      setSelectedOption(newValue);
      dispatchContext?.(newValue.telefono);
      onSelectCliente?.(newValue);
      return;
    }

    setSelectedOption(null);
  };

  const handleAutocompleteInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    const numericValue = sanitizePhone(newInputValue);
    lastDispatched.current = numericValue;
    setInputValue(numericValue);
    dispatchContext?.(numericValue);
  };

  if (ctxOptions) {
    return (
      <Autocomplete<Cliente, false, false, true>
        freeSolo
        openOnFocus
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.telefono
        }
        isOptionEqualToValue={(option, val) =>
          typeof val === "string" ? option.telefono === val : option.id === val.id
        }
        getOptionKey={(option) =>
          typeof option === "string" ? option : option.id
        }
        options={options}
        value={selectedOption}
        inputValue={inputValue}
        onChange={handleAutocompleteChange}
        onInputChange={handleAutocompleteInputChange}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus={autoFocus}
            name="telefono"
            id="outlined-basic"
            label="Teléfono"
            variant={variant || "filled"}
            placeholder="Ingresa teléfono"
            type="tel"
            sx={{ width: "100%" }}
          />
        )}
        renderOption={(props, option) => {
          const cliente =
            typeof option === "string"
              ? { nombre: "", telefono: option }
              : option;
          const { key, ...optionProps } = props;
          return (
            <Box component="li" key={`${key}-${cliente.telefono}`} {...optionProps}>
              {cliente.nombre
                ? `${cliente.telefono} — ${cliente.nombre}`
                : cliente.telefono}
            </Box>
          );
        }}
      />
    );
  }

  return (
    <>
      <TextField
        autoFocus={autoFocus}
        name="telefono"
        id="outlined-basic"
        label="Teléfono"
        variant={variant || "filled"}
        placeholder="Ingresa teléfono"
        type="tel"
        value={valueContext ? valueContext : value}
        onChange={handleChange}
        sx={{ width: "100%" }}
        slotProps={{
          input: {
            endAdornment: searchIcon ? (
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={() =>
                  handleSearch &&
                  handleSearch(valueContext ? valueContext : value)
                }
              >
                <SearchIcon />
              </IconButton>
            ) : null,
          },
        }}
      />
    </>
  );
}

export default PhoneInput;
