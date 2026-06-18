import { InputAdornment, TextField } from "@mui/material";

type Props = {
  value?: number;
  error?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "filled" | "outlined" | "standard";
};

function PrecioInput({ value, error, onChange, variant }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Permitir solo números y un punto decimal
    const regex = /^\d*\.?\d*$/;
    if (regex.test(inputValue)) {
      onChange?.(e);
    }
  };

  return (
    <TextField
      id="input-with-icon-textfield"
      variant={variant || "filled"}
      label="Precio"
      name="precio"
      value={value || 0}
      error={error}
      helperText={error ? "El precio es requerido" : ""}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        },
      }}
    />
  );
}

export default PrecioInput;
