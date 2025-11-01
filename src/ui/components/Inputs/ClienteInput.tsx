import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type Props = {
    name?: string;
    contextValue?: string;
    dispatchContext?: (value : string) => void
}

function ClienteInput({name, contextValue, dispatchContext}:Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent) => {
    const tValue = e.target.value;
    const clientValue = tValue.replace(/[^a-zA-Z\s]*$/, "");
    dispatchContext ? dispatchContext(clientValue) : setValue(clientValue);
  };

  return (
    <TextField
      type="text"
      name={name}
      id="outlined-basic-client-input"
      label="Nombre del Cliente"
      variant="filled"
      sx={{ width: "100%" }}
      value={contextValue ? contextValue : value}
      onChange={handleChange}
    />
  );
}

export default ClienteInput;
