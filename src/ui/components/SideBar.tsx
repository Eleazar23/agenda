import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSideBarContext } from '../contexts/SideBarContext';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentIcon from '@mui/icons-material/Payment';
import { Link } from 'react-router-dom';

export const SIDEBAR_WIDTH_EXPANDED = 230;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

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
    title: "Gastos",
    value: "gastos",
    icon: <PaymentIcon />
  },
  {
    title: "Reportes",
    value: "reportes",
    icon: <BarChartIcon />
  },
]

export default function SideBar() {
  const { sideBarData, setSideBarData } = useSideBarContext()
  const { isOpen } = sideBarData

  const handleOnClickItem = (value: string) => () => {
    setSideBarData((prev) => ({ ...prev, currentPage: value }))
  }

  const width = isOpen ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        '& .MuiDrawer-paper': {
          position: 'static',
          width,
          overflowX: 'hidden',
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Box role="presentation">
        <List>
          {menuItems.map((item) => {
            const selected = item.value === sideBarData.currentPage;
            const buttonContent = (
              <ListItemButton
                selected={selected}
                onClick={handleOnClickItem(item.value)}
                sx={{
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  px: isOpen ? 2.5 : 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2 : 0,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && <ListItemText primary={item.title} />}
              </ListItemButton>
            );
            return (
              <ListItem key={item.value} disablePadding sx={{ display: 'block' }}>
                <Link
                  to={`${item.value}`}
                  style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  aria-label={item.title}
                >
                  {isOpen ? (
                    buttonContent
                  ) : (
                    <Tooltip title={item.title} placement="right">
                      {buttonContent}
                    </Tooltip>
                  )}
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
