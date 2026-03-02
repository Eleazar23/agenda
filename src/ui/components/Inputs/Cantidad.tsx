import React, { useEffect } from "react";
import { TextField } from "@mui/material";

type Props = {
  ctxValue?: number;
  ctxOnChange?: (newValue: number) => void;
  variant?: "outlined" | "standard" | "filled";
  size?: "medium" | "small";
  name?: string;
  defaultProps?: any;
};

function CantidadInput({
  ctxValue,
  ctxOnChange,
  variant,
  size,
  name,
  ...defaultProps
}: Props) {
  const [value, setValue] = React.useState(ctxValue || 1);
  const MAX_VALUE = 50;
  const MIN_VALUE = 1; // Define un valor mínimo para evitar números negativos o cero

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const unformattedInput = event.target.value;
    if (unformattedInput === "" || /^[0-9]+$/.test(unformattedInput)) {
      const newValue = parseInt(unformattedInput);
      if (newValue >= MIN_VALUE && newValue <= MAX_VALUE) {
        setValue(newValue);
        return;
      }
    }
  };

  useEffect(() => {
    ctxOnChange && ctxOnChange(value);
  }, [value]);

  return (
    <>
      <TextField
        label="Cantidad"
        name={name|| "cantidad"}
        type="number"
        variant={variant || "outlined"}
        value={ctxValue || value}
        onChange={handleChange}
        size={size || undefined}
        {...defaultProps}
        sx={{
          "& .MuiInputBase-input": { textAlign: "center" },
        }}
      />
    </>
  );
}

export default CantidadInput;
