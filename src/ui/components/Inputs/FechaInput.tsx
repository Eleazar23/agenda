import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { formatDateToHTML, getCurrentDate, formatDateFromHTML } from "../../utils/utils";

const { formattedDate } = getCurrentDate();

type Props = {
    ctxValue?: string;
    ctxDispatch?: (inputName:string, value: string) => void;
};

function FechaInput({ ctxValue, ctxDispatch }: Props) {
    const [value, setValue] = React.useState(formattedDate);

    const handleDateChange = (newValue: string) => {
        const formattedNewValue = formatDateFromHTML(newValue);
        console.log({newValue, formattedNewValue});
        setValue(formattedNewValue);
    }

    useEffect(() => {
        if (ctxDispatch) {
            ctxDispatch("fecha", value);
        }
    }, [value]);

  return (
    <TextField
      type="date"
      name="fecha"
      id="filled-basic"
      label="Fecha"
      variant="filled"
      value={formatDateToHTML(value)}
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
}

export default FechaInput;
