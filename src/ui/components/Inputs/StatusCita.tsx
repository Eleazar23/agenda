import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const statusOptions = ["Pendiente","En proceso...", "Pagado"];

export default function StatusCita(props:any) {
  return (
    <Autocomplete
      options={statusOptions}
      renderInput={(params) => <TextField {...params} label="Estado" variant='filled' />}
      defaultValue={statusOptions[0]}
      {...props}
    />
  );
}
