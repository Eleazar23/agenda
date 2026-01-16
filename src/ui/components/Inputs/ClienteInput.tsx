import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type Props = {
  name?: string;
  contextValue?: string;
  dispatchContext?: (value: string) => void;
};

function ClienteInput({ name, contextValue, dispatchContext }: Props) {
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
      slotProps={{
        input: {
          endAdornment: (
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
}

export default ClienteInput;
