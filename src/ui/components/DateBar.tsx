import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function DateBar() {
    const now = dayjs()
    const day = now.get('date')
    const month = now.get('month')
    const year = now.get('year')
    // console.log({day, month, year})
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      views={['year', 'month', 'day']}
      openTo='day'
      format={'DD/MM/YYYY'}
      defaultValue={now}
      slotProps={
        {
            textField: {
                sx:{
                    backgroundColor: 'white',
                    borderRadius: '.5rem',
                    height: '48px',
                    '& .MuiPickersInputBase-root': {
                        height: '48px',
                    }
                }
            }
        }
      }
       />
    </LocalizationProvider>
  );
}
