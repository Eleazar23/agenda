import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type Props = {
  name?: string;
  ctxValue?: string;
  dispatchContext?: (value: string) => void;
  handleSearch?: (e: React.MouseEvent<HTMLButtonElement>, value: string) => void;
};

function ClienteInput({
  name,
  ctxValue,
  dispatchContext,
  handleSearch,
}: Props) {
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
      value={ctxValue ? ctxValue : value}
      onChange={handleChange}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={(e) =>
                handleSearch &&
                handleSearch(e, (ctxValue ? ctxValue : value))
              }
            >
              <SearchIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
}

export default ClienteInput;