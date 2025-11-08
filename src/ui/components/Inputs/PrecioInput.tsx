import { InputAdornment, TextField } from "@mui/material";

type Props = {
  value?: null | string;
};

function PrecioInput({ value }: Props) {
  return (
    <TextField
      id="input-with-icon-textfield"
      variant="filled"
      label="Precio"
      value={value ? value : "000"}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        },
      }}
    />
  );
}

export default PrecioInput;
