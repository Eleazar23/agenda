import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  valueContext?: string;
  dispatchContext?: (value: string) => void;
  searchIcon?: boolean;
  variant?: "filled" | "outlined" | "standard";
  handleSearch?: (value: string) => void;
  autoFocus?: boolean;
};

function PhoneInput({
  valueContext,
  dispatchContext,
  searchIcon = true,
  variant,
  handleSearch,
  autoFocus,
}: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const checkDigits = (value: string) => {
    if (value.length > 10) {
      handleError("Telefono solo puede tener 10 digitos");
      return false;
    }
    setError(false);
    setErrorText("");
    return true;
  };

  const handleError = (errorText: string) => {
    setError(true);
    setErrorText(errorText);
    setTimeout(() => {
      setError(false);
      setErrorText("");
    }, 2000);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ChangingPhone");
    const newValue = event.target.value;
    // Allow only digits (0-9)
    const numericValue = newValue.replace(/[^0-9]/g, "");
    if (checkDigits(numericValue)) {
      dispatchContext ? dispatchContext(numericValue) : setValue(numericValue);
    }
  };

  return (
    <>
      <TextField
        autoFocus={autoFocus}
        name="telefono"
        error={error}
        id="outlined-basic"
        label="Teléfono"
        variant={variant || "filled"}
        placeholder="Ingresa teléfono"
        type="tel"
        value={valueContext ? valueContext : value}
        onChange={handleChange}
        sx={{ width: "100%" }}
        helperText={errorText}
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
