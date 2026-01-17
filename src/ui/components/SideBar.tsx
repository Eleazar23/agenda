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
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link } from 'react-router-dom';


const menuItems = [
  {
    title: "Agenda",
    value: "agenda",
    icon: <EventNoteIcon />
  },
  {
    title: "Clientes",
    value: "clientes",
    icon: <PeopleIcon />
  },
  {
    title: "Estilistas",
    value: "estilistas",
    icon: <EmojiPeopleIcon />
  },
  {
    title: "Productos",
    value: "productos",
    icon: <LocalGroceryStoreIcon />
  },
  {
    title: "Servicios",
    value: "servicios",
    icon: <StorefrontIcon />
  },
  {
    title: "Reportes",
    value: "reportes",
    icon: <InboxIcon />
  },
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
      {/* <Divider />
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
      </List> */}
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
