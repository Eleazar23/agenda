import React from 'react'
import { Grid } from "@mui/material";
import ClienteForm from '../forms/ClienteForm';

const ClienteContainer = () => {
    return (
        <Grid size={12}>
            <ClienteForm />
        </Grid>
    )
}

export default ClienteContainer;