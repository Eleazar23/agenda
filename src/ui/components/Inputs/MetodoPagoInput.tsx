import {
  MenuItem,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import React from "react";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName: string, value: string) => void;
  readOnly?: boolean;
  name?: string;
  label?: string;
  variant?: TextFieldVariants;
  size?: "small" | "medium";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

const options = [
  {
    value: "efectivo",
    label: "Efectivo",
  },
  {
    value: "tarjeta",
    label: "Tarjeta",
  },
  {
    value: "transferencia",
    label: "Transferencia",
  },
];

function MetodoPagoInput({
  ctxValue,
  ctxDispatch,
  readOnly,
  name = "metodoPago",
  label = "Método de Pago",
  variant = "filled",
  size,
  fullWidth = true,
  sx,
}: Props) {
  const [value, setValue] = React.useState<string>(ctxValue || "efectivo");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (ctxDispatch) {
      ctxDispatch(name, event.target.value as string);
    } else {
      setValue(event.target.value as string);
    }
  };

  return (
    <TextField
      select
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      sx={sx}
      name={name}
      type="select"
      id="metodo-pago-input"
      label={label}
      onChange={(e) => handleChange(e)}
      value={ctxValue || value}
      slotProps={{ input: { readOnly: readOnly } }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default MetodoPagoInput;
