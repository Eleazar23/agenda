import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import DateBar from './DateBar';
import FeriadoModal from './modals/FeriadoModal';
import BloqueoModal from './modals/BloqueoModal';
import { useSideBarContext } from '../contexts/SideBarContext';
import { useNotasCtx } from '../contexts/NotasCtx';
import { useAgendaContext } from '../contexts/AgendaContext';
import { useFeriadosCtx } from '../contexts/FeriadosCtx';

export default function MenuAppBar() {
  const {sideBarData, setSideBarData} = useSideBarContext()
  const { isNotasOpen, toggleNotasOpen, pendingCount } = useNotasCtx()
  const { fecha } = useAgendaContext();
  const { feriados } = useFeriadosCtx();
  const [isFeriadoModalOpen, setIsFeriadoModalOpen] = React.useState(false);
  const [isBloqueoModalOpen, setIsBloqueoModalOpen] = React.useState(false);

  const esAgenda = sideBarData.currentPage == "agenda";
  const esFeriado = feriados.some((f) => f.fecha === fecha);

    const handleToggleDrawer = () =>{
      const {isOpen} = sideBarData
      setSideBarData({...sideBarData, isOpen: !isOpen})
    }


  return (
    <Box sx={{ flexShrink: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="expandir o colapsar menú"
            sx={{ mr: 2 }}
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Status Salon | {sideBarData.currentPage.charAt(0).toUpperCase() + sideBarData.currentPage.slice(1)}
          </Typography>
          {esAgenda ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DateBar />
              <Button
                size="small"
                variant={esFeriado ? "contained" : "outlined"}
                color={esFeriado ? "error" : "inherit"}
                startIcon={<EventBusyIcon />}
                onClick={() => setIsFeriadoModalOpen(true)}
              >
                Feriado
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<FreeBreakfastIcon />}
                onClick={() => setIsBloqueoModalOpen(true)}
              >
                Descanso
              </Button>
              <Badge badgeContent={pendingCount} color="error">
                <Button
                  size="small"
                  variant={isNotasOpen ? "contained" : "outlined"}
                  color={isNotasOpen ? "secondary" : "inherit"}
                  startIcon={<NoteAltIcon />}
                  aria-label="notas"
                  onClick={toggleNotasOpen}
                >
                  Notas
                </Button>
              </Badge>
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>
      {esAgenda ? (
        <>
          <FeriadoModal isOpen={isFeriadoModalOpen} onClose={() => setIsFeriadoModalOpen(false)} />
          <BloqueoModal isOpen={isBloqueoModalOpen} onClose={() => setIsBloqueoModalOpen(false)} />
        </>
      ) : null}
    </Box>
  );
}
