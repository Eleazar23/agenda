import * as React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";
import { statusCitaOptions } from "../../utils/StatusCitaOptions";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName: string, value: string) => void;
  readOnly?: boolean;
};

// const options = ["sin confirmar","confirmado", "en proceso", "pagado", "cancelado", "no asistio", "finalizado"];

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function StatusCita({ ctxValue, ctxDispatch, readOnly }: Props) {
  const [value, setValue] = React.useState<string>(ctxValue || statusCitaOptions[0].value);

  React.useEffect(() => {
    if (ctxValue !== undefined) {
      setValue(ctxValue);
    }
  }, [ctxValue]);

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
        defaultValue={statusCitaOptions[0].value}
      >
        {statusCitaOptions.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {capitalizeFirstLetter(option.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
