import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAgendaContext } from "../../contexts/AgendaContext";

type Props = {
  serviceIndex: number;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

const options = [ // fix when mongo db working
  "Corte de Cabello H",
  "Corte de Cabello M",
  "Tinte",
  "Peinado",
];

export default function SeriviceInput({ serviceIndex }: Props) {
  const { updateService } = useAgendaContext();
  const [value, setValue] = React.useState<null | string>(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    updateService(serviceIndex, value);
  }, [value, inputValue]);

  return (
    <Autocomplete
      options={options}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} sx={styles.textField} label="Servicio" variant="filled" />
      )}
      value={value}
      onChange={(event: any, newValue: null | string) => {
        event.preventDefault()
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        console.log(event)
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
    />
  );
}
