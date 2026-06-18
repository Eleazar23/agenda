// import type { ICellRendererParams } from 'ag-grid-community';
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  onClick?: () => void;
};

const EditBtn = ({ onClick }: Props) => {
  return (
    <Tooltip title="Editar">
      <IconButton aria-label="delete" size="small" onClick={onClick}>
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default EditBtn;
