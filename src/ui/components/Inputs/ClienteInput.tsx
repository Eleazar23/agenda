import React, { useEffect, useState } from "react";
import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Cliente } from "../../types/Cliente";
import { useThrottle } from "../../hooks/useThrottle";

type Props = {
  name?: string;
  ctxValue?: string;
  autoFocus?: boolean;
  ctxOptions?: Cliente[];
  dispatchContext?: (value: string) => void;
  handleSearch?: (e: React.MouseEvent<HTMLButtonElement>, value: string) => void;
  onSelectCliente?: (cliente: Cliente) => void;
};

function ClienteInput({
  name,
  ctxValue,
  dispatchContext,
  autoFocus,
  handleSearch,
  onSelectCliente,
  ctxOptions,
}: Props) {
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  const [options, setOptions] = useState<Cliente[]>([]);
  const [inputValue, setInputValue] = useState<string>(ctxValue || "");
  const [selectedOption, setSelectedOption] = useState<Cliente | string | null>(
    ctxValue || "",
  );

  const fetchClientes = useThrottle(async (query: string) => {
    if (!query.trim()) {
      setOptions(allClientes);
      return;
    }

    const filtered = allClientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(query.toLowerCase()),
    );

    if (filtered.length > 0) {
      setOptions(filtered);
      return;
    }

    try {
      const clientes = await window.api.getClientesByNombre(query);
      setOptions(clientes || []);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      setOptions([]);
    }
  }, 300);

  const loadClientes = async () => {
      try {
        const clientes = await window.api.getClientes();
        setAllClientes(clientes || []);
        setOptions(clientes || []);
      } catch (error) {
        console.error("Error preloading clientes:", error);
        setAllClientes([]);
        setOptions([]);
      }
    };
  

  useEffect(() => {
    if (ctxOptions) {
      setAllClientes(ctxOptions);
      setOptions(ctxOptions);
      return;
    }
    loadClientes();
  }, [ctxOptions]);

  useEffect(() => {
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
    setInputValue(newInputValue);
    dispatchContext?.(newInputValue);
    // if (newInputValue.trim().length > 0) {
    //   fetchClientes(newInputValue);
    //   return;
    // }
    // setOptions(allClientes);
  };

  return (
    <Autocomplete<Cliente, false, false, true>
      freeSolo
      openOnFocus
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.nombre
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
