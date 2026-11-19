// import type { ICellRendererParams } from 'ag-grid-community';
import type { MouseEvent } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const EditBtn = ({ onClick }: Props) => {
  return (
    <Tooltip title="Editar">
      <IconButton aria-label="editar" size="small" onClick={onClick}>
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default EditBtn;
