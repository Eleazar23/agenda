import { IconButton, Tooltip } from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

type Props = {
  onClick?: () => void;
};

const VacacionesBtn = ({ onClick }: Props) => {
  return (
    <Tooltip title="Vacaciones">
      <IconButton aria-label="vacaciones" size="small" onClick={onClick}>
        <BeachAccessIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default VacacionesBtn;
