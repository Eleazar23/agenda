import CssBaseline from "@mui/material/CssBaseline";
import MenuAppBar from "./components/MenuAppBar";
import "./App.css";
import SideBar from "./components/SideBar";
import { SideBarContextProvider } from "./contexts/SideBarContext";
import { HashRouter as Router } from "react-router-dom";
import Home from "./components/pages/Home";
import { AgendaContextProvider } from "./contexts/AgendaContext";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <>
      
      <Router basename="/">
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <SideBarContextProvider>
            <AgendaContextProvider>
              <CssBaseline />
              <MenuAppBar />
              <SideBar />
              <Home />
            </AgendaContextProvider>
          </SideBarContextProvider>
        </SnackbarProvider>
      </Router>
    </>
  );
}

export default App;
