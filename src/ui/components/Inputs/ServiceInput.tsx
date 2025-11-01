import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAgendaContext } from "../../contexts/AgendaContext";

type Props = {
  serviceIndex: number;
};

const options = [
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
    console.log("SlectedService", { value, inputValue });
    updateService(serviceIndex, value);
  }, [value, inputValue]);

  return (
    <Autocomplete
      options={options}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField {...params} label="Servicio" variant="filled" />
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
