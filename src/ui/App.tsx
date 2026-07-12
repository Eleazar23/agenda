import CssBaseline from "@mui/material/CssBaseline";
import MenuAppBar from "./components/MenuAppBar";
import "./App.css";
import SideBar from "./components/SideBar";
import { SideBarContextProvider } from "./contexts/SideBarContext";
import { HashRouter as Router } from "react-router-dom";
import Home from "./components/pages/Home";
import { AgendaContextProvider } from "./contexts/AgendaContext";
import { NotasCtxProvider } from "./contexts/NotasCtx";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <>

      <Router basename="/">
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <SideBarContextProvider>
            <AgendaContextProvider>
              <NotasCtxProvider>
                <CssBaseline />
                <MenuAppBar />
                <SideBar />
                <Home />
              </NotasCtxProvider>
            </AgendaContextProvider>
          </SideBarContextProvider>
        </SnackbarProvider>
      </Router>
    </>
  );
}

export default App;
