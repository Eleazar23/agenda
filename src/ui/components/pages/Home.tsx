import { Route, Routes } from "react-router-dom";
import ClientsTables from "../tables/ClientsTable";
import Agenda from "./Agenda";
import Estilistas from "./Estilistas";
import { Grid } from "@mui/material";
import Clientes from "./Clientes";

export default function Home() {
  return (
    <>
      <Grid
        container
        sx={{ height: "calc(100% - 64px)", padding: "1rem" }}
        gap={1}
        flexWrap={"nowrap"}
        size={12}
      >
        <Routes>
          <Route path="/" element={<Agenda />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/estilistas" element={<Estilistas />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </Grid>
    </>
  );
}
