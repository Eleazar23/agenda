import Grid from "@mui/material/Grid";
import { Alert, Box, Paper } from "@mui/material";
import AgendaTable from "../tables/AgendaTable";
import NuevaCitaContainer from "../containers/NuevaCitaContainer";
import { useAgendaContext } from "../../contexts/AgendaContext";
import CitaModal from "../modals/CitaModal";
import NotasPanel from "../panels/NotasPanel";
import { useNotasCtx } from "../../contexts/NotasCtx";

function Agenda() {
  const { isBooking } = useAgendaContext();
  const { isNotasOpen } = useNotasCtx();

  const tableSize = isBooking && isNotasOpen ? 6 : isBooking || isNotasOpen ? 9 : 12;

  return (
    <>
      <Grid container gap={1} spacing={1} flexWrap={"nowrap"} size={12}>
        {isBooking ? (
          <Grid container size={3}>
            <Paper elevation={1} sx={{ height: "100%", width: "100%" }}>
              <NuevaCitaContainer />
            </Paper>
          </Grid>
        ) : null}

        <Grid container size={tableSize}>
          <Paper elevation={1} sx={{ height: "100%", width: "100%" }}>
            <AgendaTable />
          </Paper>
        </Grid>

        {isNotasOpen ? (
          <Grid container size={3}>
            <NotasPanel />
          </Grid>
        ) : null}
        {/* <CitaModal /> */}
      </Grid>
    </>
  );
}

export default Agenda;
