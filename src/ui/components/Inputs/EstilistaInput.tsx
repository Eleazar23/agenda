import * as React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Autocomplete, FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName:string, value: string) => void;
  readOnly?: boolean;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

const options = ["tomi", "felix", "magi", "arturo", "mimi"];

export default function EstilistaInput({
  ctxValue,
  ctxDispatch,
  readOnly,
}: Props) {
  const [value, setValue] = React.useState<string>(ctxValue || "");
  const handleChange = (event: SelectChangeEvent) => {
    if (ctxDispatch) {
      ctxDispatch("estilista", event.target.value as string);
    } else {
      setValue(event.target.value as string);
    }
  };

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id="demo-select-label">Estilista</InputLabel>
      <Select
        labelId="demo-select-label"
        id="demo-select"
        value={ctxValue || value}
        label="Estilista"
        onChange={handleChange}
        sx={styles.textField}
        inputProps={{ readOnly: readOnly }}
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
