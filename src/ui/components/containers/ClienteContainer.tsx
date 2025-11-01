import React from 'react'
import { Grid } from "@mui/material";
import ClienteCard from '../cards/ClienteCard';

const ClienteContainer = () => {
    return (
        <Grid size={12}>
            <ClienteCard />
        </Grid>
    )
}

export default ClienteContainer;