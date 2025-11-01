import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './SearchBar';
import DateBar from './DateBar';
import { useSideBarContext } from '../contexts/SideBarContext';
import SearchInput from './Inputs/SearchInput';

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const {sideBarData, setSideBarData} = useSideBarContext()
  
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
            Status Salon
          </Typography>
          {/* {sideBarData.currentPage == "agenda" ? <DateBar /> : <SearchBar />} */}
          {sideBarData.currentPage == "agenda" ? <DateBar /> : <SearchInput />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
