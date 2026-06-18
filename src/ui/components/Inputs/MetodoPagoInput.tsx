import {
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName: string, value: string) => void;
  readOnly?: boolean;
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
];

function MetodoPagoInput({ ctxValue, ctxDispatch, readOnly }: Props) {
  const [value, setValue] = React.useState<string>(ctxValue || "efectivo");

  const handleChange = (event: any) => {
    if (ctxDispatch) {
      ctxDispatch("metodoDePago", event.target.value as string);
    } else {
      setValue(event.target.value as string);
    }
  };

  return (
    <TextField
      select
      variant="filled"
      fullWidth
      name="metododepago"
      type="select"
      id="metodo-pago-input"
      label="Metodo de Pago"
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
