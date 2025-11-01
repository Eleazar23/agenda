import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useSideBarContext } from '../contexts/SideBarContext';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';


const menuItems = [
  {
    title: "Agenda",
    value: "agenda",
    icon: <InboxIcon />
  },
  {
    title: "Clientes",
    value: "clientes",
    icon: <InboxIcon />
  },
  {
    title: "Estilistas",
    value: "estilistas",
    icon: <MailIcon />
  },
  {
    title: "Productos",
    value: "productos",
    icon: <InboxIcon />
  },
  {
    title: "Reportes",
    value: "reportes",
    icon: <InboxIcon />
  },
  {
    title: "Configuracion",
    value: "configuracion",
    icon: <SettingsIcon />
  }
]

export default function SideBar() {
  const { sideBarData, setSideBarData } = useSideBarContext()

  const handleToggleDrawer = () => {
    const { isOpen } = sideBarData
    setSideBarData({ ...sideBarData, isOpen: !isOpen })
  }

  const handleOnClickItem = (value: string) => () => {
    const { isOpen } = sideBarData
    console.log("Click on:")
    setSideBarData({ ...sideBarData, currentPage: value, isOpen: !isOpen })
    console.log(value)
  }


  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map(item => (
          <ListItem key={item.value} disablePadding>
            <Link to={`${item.value}`} style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
              <ListItemButton selected={item.value === sideBarData.currentPage} onClick={handleOnClickItem(item.value)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={sideBarData.isOpen} onClose={handleToggleDrawer}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
