import { TextField, TextFieldVariants } from "@mui/material";
import React, { useEffect } from "react";
import { formatDateToHTML, getCurrentDate, formatDateFromHTML } from "../../utils/utils";

const { formattedDate } = getCurrentDate();

type Props = {
    ctxValue?: string;
    ctxDispatch?: (inputName:string, value: string) => void;
    variant?: TextFieldVariants;
    size?: "small" | "medium";
};

function FechaInput({ ctxValue, ctxDispatch, variant = "filled", size }: Props) {
    const [value, setValue] = React.useState(ctxValue || formattedDate);

    const handleDateChange = (newValue: string) => {
        const formattedNewValue = formatDateFromHTML(newValue);
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
      variant={variant}
      size={size}
      value={formatDateToHTML(value)}
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
}

export default FechaInput;
