import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import MenuAppBar from "./components/MenuAppBar";
import "./App.css";
import SideBar from "./components/SideBar";
import { SideBarContextProvider } from "./contexts/SideBarContext";
import { HashRouter as Router } from "react-router-dom";
import Home from "./components/pages/Home";
import { AgendaContextProvider } from "./contexts/AgendaContext";
import { NotasCtxProvider } from "./contexts/NotasCtx";
import { FeriadosCtxProvider } from "./contexts/FeriadosCtx";
import { SnackbarProvider } from "notistack";
import { theme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <SideBarContextProvider>
            <FeriadosCtxProvider>
              <AgendaContextProvider>
                <NotasCtxProvider>
                  <CssBaseline />
                  <MenuAppBar />
                  <SideBar />
                  <Home />
                </NotasCtxProvider>
              </AgendaContextProvider>
            </FeriadosCtxProvider>
          </SideBarContextProvider>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
