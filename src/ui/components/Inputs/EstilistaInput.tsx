import * as React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/utils";
import { Estilista } from "../../types/Estilista";

type Props = {
  ctxValue?: string;
  ctxDispatch?: (inputName:string, value: string) => void;
  readOnly?: boolean;
  variant?: "filled" | "outlined" | "standard";
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

export default function EstilistaInput({
  ctxValue,
  ctxDispatch,
  readOnly,
  variant,
}: Props) {
  const [estilistas, setEstilistas] = React.useState<Estilista[]>([]);
  const [selected, setSelected] = React.useState<string>("");

  React.useEffect(() => {
    const fetchEstilistas = async () => {
      try {
        const data = await window.api.getEstilistas();
        console.log("Fetched estilistas:", data);
        setEstilistas(data);
      } catch (error) {
        console.error("Error fetching estilistas:", error);
      }
    };
    fetchEstilistas();
  }, []);

  React.useEffect(() => {
    if (estilistas.length > 0) {
      const defaultValue = ctxValue || estilistas[0].name;
      setSelected(defaultValue);

      if (!ctxValue && ctxDispatch) {
        ctxDispatch("estilista", defaultValue);
      }
    }
  }, [ctxValue, estilistas, ctxDispatch]);

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setSelected(newValue);
    if (ctxDispatch) {
      ctxDispatch("estilista", newValue);
    }
  };

  return (
    <FormControl variant={variant || "filled"} fullWidth>
      <InputLabel id="demo-select-label">Estilista</InputLabel>
      <Select
        labelId="demo-select-label"
        id="demo-select"
        value={selected}
        label="Estilista"
        onChange={handleChange}
        sx={styles.textField}
        inputProps={{ readOnly: readOnly }}
      >
        {estilistas.map((estilista) => (
          <MenuItem key={estilista.id} value={estilista.name}>
            {capitalizeFirstLetter(estilista.name)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
