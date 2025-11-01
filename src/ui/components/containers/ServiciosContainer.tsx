import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ServiciosCard from "../cards/ServiciosCard";
import { useAgendaContext } from "../../contexts/AgendaContext";

const ServiciosContainer = () => {
  // const { agendaData, setAgendaData } = useAgendaContext();
  // const { isBooking, cita } = agendaData;
  // const [servicios, setServicios] = useState<[] | Array<any>>([])

  // useEffect(()=>{
  //   setServicios(agendaData.cita.servicios)

  // }, [agendaData.cita.servicios])
  return (
    <Grid size={12} sx={{ width: "100%", height: "100%" }}>
      <ServiciosCard  />
    </Grid>
  );
};

export default ServiciosContainer;
