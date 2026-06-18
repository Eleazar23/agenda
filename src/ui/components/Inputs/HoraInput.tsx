import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

type Props = {
  label: string;
  readOnly?: boolean;
  hora?: string;
  onChange?: (newHora: string) => void;
  name?: string;
};


export default function HoraInput({ label, readOnly, hora, onChange, name }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        type="time"
        variant="filled"
        label={label}
        fullWidth
        name={name}
        slotProps={{ 
          input: { 
            readOnly: readOnly,
          },
          htmlInput: { step: "1800" }
        }}
        value={hora ? hora : "09:00"}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </LocalizationProvider>
  );
}
