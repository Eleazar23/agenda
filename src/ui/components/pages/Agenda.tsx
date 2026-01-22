import Grid from "@mui/material/Grid";
import { Alert, Box, Paper } from "@mui/material";
import AgendaTable from "../tables/AgendaTable";
import NuevaCitaContainer from "../containers/NuevaCitaContainer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import CitaModal from "../modals/CitaModal";

function Agenda() {
  const { isBooking } = useAgendaContext();
  

  return (
    <>
    <Grid container gap={1} flexWrap={"nowrap"} size={12}>
      {isBooking ? (
        <Grid container size={6}>
          <Paper elevation={1} sx={{ height: "100%" }}>
            <NuevaCitaContainer />
          </Paper>
        </Grid>
      ) : null}

      <Grid size={isBooking ? 6:12}>
        <Paper elevation={1} sx={{ height: "100%", width: "100%" }}>
          <AgendaTable />
        </Paper>
      </Grid>
      {/* <CitaModal /> */}
    </Grid>
    </>
  );
}

export default Agenda;
