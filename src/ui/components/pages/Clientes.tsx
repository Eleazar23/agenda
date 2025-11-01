import * as React from 'react';
import { Grid, Paper } from '@mui/material';
import ClientsTables from '../tables/ClientsTable';

const Clientes = () => {
    // Usar useSate para abrir y cerrar modal
    return (
    // Data Grid will fill the size of the parent container
    <Grid container sx={{width:"100%"}} spacing={2}>
        <Grid container size={12}>
            <Paper sx={{width:"100%", padding:2}}>
            Btn container
            </Paper>
        </Grid>
        <Grid container sx={{height:"90%"}} size={12}>
        <ClientsTables />
        </Grid>
        {/* modal */}
    </Grid>
)
}

export default Clientes;