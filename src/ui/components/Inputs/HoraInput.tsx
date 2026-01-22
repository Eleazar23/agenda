import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Input, TextField } from "@mui/material";
import { getHrs } from "../../utils/utils";

type Props = {
  label: string;
  readOnly?: boolean;
  hora?: string;
  onChange?: (newHora: string) => void;
};



export default function HoraInput({ label, readOnly, hora, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        type="time"
        variant="filled"
        label={label}
        fullWidth
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
