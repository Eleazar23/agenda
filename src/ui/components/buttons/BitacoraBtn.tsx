import { IconButton, Tooltip } from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

interface BitacoraBtnProps {
  onClick: () => void;
}

const BitacoraBtn = ({ onClick }: BitacoraBtnProps) => {
  return (
    <Tooltip title="Bitácora">
      <IconButton aria-label="bitacora" size="small" onClick={onClick}>
        <LocalLibraryIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default BitacoraBtn;
