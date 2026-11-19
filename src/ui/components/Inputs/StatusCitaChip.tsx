import * as React from "react";
import { Box, Chip, ListItemIcon, Menu, MenuItem } from "@mui/material";
import FieldLabel from "./FieldLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { capitalizeFirstLetter } from "../../utils/utils";
import { statusCitaOptions } from "../../utils/StatusCitaOptions";
import { getEstadoCitaColor } from "../../utils/estadoCitaColors";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName: string, value: string) => void;
  readOnly?: boolean;
};

export default function StatusCitaChip({ ctxValue, ctxDispatch, readOnly }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const value = ctxValue || statusCitaOptions[0].value;
  const { color, bg } = getEstadoCitaColor(value);
  const current = statusCitaOptions.find((o) => o.value === value);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (readOnly) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (newValue: string) => {
    ctxDispatch?.("estado", newValue);
    handleClose();
  };

  return (
    <Box>
      <FieldLabel>Estado de la cita</FieldLabel>
      <Chip
        onClick={handleOpen}
        icon={<FiberManualRecordIcon sx={{ fontSize: "8px !important", color: `${color} !important` }} />}
        deleteIcon={<ExpandMoreIcon />}
        onDelete={readOnly ? undefined : handleOpen}
        label={capitalizeFirstLetter(current?.label || value)}
        sx={{
          bgcolor: bg,
          color,
          fontWeight: 700,
          px: 0.5,
          "& .MuiChip-deleteIcon": { color },
        }}
      />
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        {statusCitaOptions.map((option) => {
          const optionColor = getEstadoCitaColor(option.value);
          return (
            <MenuItem key={option.id} onClick={() => handleSelect(option.value)} selected={option.value === value}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <FiberManualRecordIcon sx={{ fontSize: 10, color: optionColor.color }} />
              </ListItemIcon>
              {capitalizeFirstLetter(option.label)}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
