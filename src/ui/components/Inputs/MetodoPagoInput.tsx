import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'

const options = [
    {
        value: "efectivo",
        label: "Efectivo"
    },
    {
        value: "tarjeta",
        label: "Tarjeta"
    }
]

function MetodoPagoInput() {
  return (
    <TextField select variant='filled' fullWidth name="metododepago" type='select' id="metodo-pago-input" defaultValue="efectivo" >
        {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
        </TextField>
  )
}

export default MetodoPagoInput