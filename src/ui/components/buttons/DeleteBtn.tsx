// import type { ICellRendererParams } from 'ag-grid-community';
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  onClick?: () => void;
};

const DeleteBtn = ({ onClick }: Props) => {
  return (
    <Tooltip title="Eliminar">
      <IconButton aria-label="delete" size="small" onClick={onClick}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteBtn;
