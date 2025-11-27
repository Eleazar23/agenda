import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Input, TextField } from "@mui/material";

type Props = {
  readOnly?: boolean;
  hora?: string;
};

export default function HoraInput({ readOnly = true, hora }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        type="time"
        variant="filled"
        label="Inicio"
        fullWidth
        slotProps={{ input: { readOnly: readOnly } }}
        value={hora ? hora : "09:00"}
      />
    </LocalizationProvider>
  );
}
