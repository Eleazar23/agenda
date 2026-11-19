import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

interface BitacoraBtnProps {
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const BitacoraBtn = ({ onClick, sx }: BitacoraBtnProps) => {
  return (
    <Tooltip title="Bitácora">
      <IconButton aria-label="bitacora" size="small" onClick={onClick} sx={sx}>
        <LocalLibraryIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default BitacoraBtn;
