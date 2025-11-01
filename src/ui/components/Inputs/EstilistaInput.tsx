import * as React from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { Autocomplete, TextField } from "@mui/material";

type Props = {
  estilista: string;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

const Estilistas = ["Tomi", "Felix", "Magi", "Arturo", "Mimi"];

export default function EstilistaInput({ estilista }: Props) {

  return (
    <Autocomplete
      disablePortal
      options={Estilistas}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Estilista"
          variant="filled"
          sx={styles.textField}
          slotProps={{ input: { readOnly: true } }}
        />
      )}
      value={estilista}
      readOnly
    />
  );
}
