import * as React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName: string, value: string) => void;
  readOnly?: boolean;
};

const options = ["sin confirmar","confirmado", "en proceso", "pagado", "cancelado", "no asistio", "finalizado"];

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function StatusCita({ ctxValue, ctxDispatch, readOnly }: Props) {
  const [value, setValue] = React.useState<string>(ctxValue || options[0]);

  const handleChange = (event: any) => {
    if (ctxDispatch) {
      ctxDispatch("estado", event.target.value as string);
    } else {
      setValue(event.target.value as string);
    }
  };

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id="select-label">Estado de la Cita</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={ctxValue || value}
        onChange={handleChange}
        sx={styles.textField}
        inputProps={{ readOnly: readOnly }}
        defaultValue={options[0]}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {capitalizeFirstLetter(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
