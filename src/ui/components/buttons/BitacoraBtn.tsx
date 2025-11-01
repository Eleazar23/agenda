import React from 'react';

// import type { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const BitacoraBtn = () => {
    return (
<IconButton aria-label="delete" size="small">
  <LocalLibraryIcon fontSize="inherit" />
</IconButton>
    );
};

export default BitacoraBtn;