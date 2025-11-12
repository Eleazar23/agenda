import { Box, Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material"
import { useState } from "react"
import { useAgendaContext } from "../../contexts/AgendaContext"

const CitaCell = ({params}: any) => {
    const {agendaData, setAgendaData} = useAgendaContext()

  // const estilista = params.column.colId
  // const hr = params.data.hr
  // const rowIndex = params.node.rowIndex

  const {value} = params
  const {servicio} = value


  const handleClick = () =>{
    // console.log({params: {estilista, hr, rowIndex}, value: params.value})
    console.log("Opening modal for:", value)
    setAgendaData({...agendaData, isCitaOpen:true, modal: value})
  }

  return (
     <Box
      sx={{
        width: '100%',
        height: '100%'
      }}
    >
        <Card sx={{height: '100%', width:'100%', backgroundColor:'primary.main'}}>
          <CardActionArea
            onClick={handleClick}
            sx={{height:"100%"}}
          >
            <CardContent sx={{ height: '100%', display:'flex', flexDirection: 'column', padding:"0.5rem"}}>
              <Typography variant="body1" fontWeight="bold" component="div" color="white">
                {value.nombreCliente}
              </Typography>
              <Typography variant="body1" component="div" color="white">
                {value.telefonoCliente}
              </Typography>
              <Typography variant="body2" color="white">
                {servicio.servicio}
              </Typography>
                <Typography variant="body2" color="white">
                Tiempo: {servicio.duracion} minutos
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </Box>
    )
}

export default CitaCell;