import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SearchBar from './SearchBar';
import DateBar from './DateBar';
import { useSideBarContext } from '../contexts/SideBarContext';
import { useNotasCtx } from '../contexts/NotasCtx';

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const {sideBarData, setSideBarData} = useSideBarContext()
  const { isNotasOpen, toggleNotasOpen, pendingCount } = useNotasCtx()

    const handleToggleDrawer = () =>{
      const {isOpen} = sideBarData
      setSideBarData({...sideBarData, isOpen: !isOpen})
      console.log({sideBarData})
    }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Status Salon | {sideBarData.currentPage.charAt(0).toUpperCase() + sideBarData.currentPage.slice(1)}
          </Typography>
          <IconButton
            size="large"
            color={isNotasOpen ? "warning" : "inherit"}
            aria-label="notas"
            onClick={toggleNotasOpen}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={pendingCount} color="error">
              <NoteAltIcon />
            </Badge>
          </IconButton>
          {/* {sideBarData.currentPage == "agenda" ? <DateBar /> : <SearchBar />} */}
          {sideBarData.currentPage == "agenda" ? <DateBar /> : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
