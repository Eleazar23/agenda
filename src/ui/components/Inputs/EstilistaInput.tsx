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
  const [value, setValue] = React.useState<string>(ctxValue || "");
  const defaultTodos: Estilista = { id: 100000, name: "todos", phone: "", displayName: "Todos" };

  React.useEffect(() => {
    const fetchEstilistas = async () => {
      try {
        const data = await window.api.getEstilistas();
        console.log("Fetched estilistas:", data);
        setEstilistas([defaultTodos, ...data]);
        if (!ctxValue && data.length > 0) {
          setValue(data[0].name);
        }
      } catch (error) {
        console.error("Error fetching estilistas:", error);
      }
    };
    fetchEstilistas();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    if (ctxDispatch) {
      ctxDispatch("estilista", event.target.value as string);
    } else {
      setValue(event.target.value as string);
    }
  };

  return (
    <FormControl variant={variant || "filled"} fullWidth>
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
        {estilistas.map((estilista) => (
          <MenuItem key={estilista.id} value={estilista.name}>
            {capitalizeFirstLetter(estilista.name)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
