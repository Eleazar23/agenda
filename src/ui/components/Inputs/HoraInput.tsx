import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import { Input, TextField } from '@mui/material';

type Props = {
  hora?: string
}

export default function HoraInput({hora}:Props) {

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <TextField type='time' variant='filled' label="Inicio" defaultValue={'09:00'} sx={{width: "100%"}} value={hora} /> */}
        <TextField type='time' variant='filled' label="Inicio" sx={{width: "100%"}} slotProps={{input: {readOnly: true}}} value={hora ? hora : '09:00'} />
    </LocalizationProvider>
  )
}


