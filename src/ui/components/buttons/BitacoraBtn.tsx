import React from 'react';

// import type { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

interface BitacoraBtnProps {
  onClick: () => void;
}

const BitacoraBtn = ({ onClick }: BitacoraBtnProps) => {
    return (
<IconButton aria-label="bitacora" size="small" onClick={onClick}>
  <LocalLibraryIcon fontSize="inherit" />
</IconButton>
    );
};

export default BitacoraBtn;