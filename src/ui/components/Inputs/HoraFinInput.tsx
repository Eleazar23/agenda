import { Autocomplete, SxProps, TextField, Theme } from "@mui/material";
import { getHrs } from "../../utils/utils";

type Props = {
  label: string;
  readOnly?: boolean;
  hora?: string;
  onChange?: (newHora: string) => void;
  size?: "small" | "medium";
  variant?: "filled" | "outlined" | "standard";
  hideLabel?: boolean;
  id?: string;
  sx?: SxProps<Theme>;
};

const hrs = getHrs().map((hora, index) => ({...hora, id: index}));

function HoraFinInput({
  label,
  readOnly,
  hora,
  onChange,
  size,
  variant = "filled",
  hideLabel,
  id,
  sx,
}: Props) {
  return (
    <Autocomplete
      id={id}
      renderInput={(params) => (
        <TextField
          label={hideLabel ? undefined : label}
          variant={variant}
          {...params}
        />
      )}
      disableClearable
      options={hrs}
      getOptionLabel={(option) => option.label12}
      value={hrs.find(h => h.label24 === hora) || undefined}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange?.(newValue.label24);
        }
      }}
      disabled={readOnly}
      size={size}
      sx={sx}
      fullWidth
    />
  );
}

export default HoraFinInput;
