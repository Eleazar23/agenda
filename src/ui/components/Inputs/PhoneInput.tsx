import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

type Props = {
  valueContext?: string;
  dispatchContext?: (value: string) => void;
};

function PhoneInput({ valueContext, dispatchContext }: Props) {
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
        name="phone"
        error={error}
        id="outlined-basic"
        label="Teléfono"
        variant="filled"
        value={valueContext ? valueContext : value}
        onChange={handleChange}
        sx={{ width: "100%" }}
        helperText={errorText}
      />
    </>
  );
}

export default PhoneInput;
