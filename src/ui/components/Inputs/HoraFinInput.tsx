import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Autocomplete, Input, TextField } from "@mui/material";
import { getHrs } from "../../utils/utils";

type Props = {
  label: string;
  readOnly?: boolean;
  hora?: string;
  onChange?: (newHora: string) => void;
};

const hrs = getHrs().map((hora, index) => ({...hora, id: index}));

function HoraFinInput({ label, readOnly, hora, onChange }: Props) {
  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField
          label={label}
          variant="filled"
          {...params}
        />
      )}
      disableClearable
      options={hrs}
      getOptionLabel={(option) => option.label12}
      value={hrs.find(h => h.label24 === hora) || undefined}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange?.(newValue.label24);
        }
      }}
      disabled={readOnly}
      fullWidth
    />
  );
}

export default HoraFinInput;
