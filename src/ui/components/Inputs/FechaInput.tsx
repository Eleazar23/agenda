import { TextField, TextFieldVariants } from "@mui/material";
import React, { useEffect } from "react";
import { formatDateToHTML, getCurrentDate, formatDateFromHTML } from "../../utils/utils";

const { formattedDate } = getCurrentDate();

type Props = {
    ctxValue?: string;
    ctxDispatch?: (inputName:string, value: string) => void;
    variant?: TextFieldVariants;
    size?: "small" | "medium";
    label?: string;
    name?: string;
    error?: boolean;
    helperText?: string;
};

function FechaInput({
    ctxValue,
    ctxDispatch,
    variant = "filled",
    size,
    label = "Fecha",
    name = "fecha",
    error,
    helperText,
}: Props) {
    const [value, setValue] = React.useState(ctxValue || formattedDate);

    const handleDateChange = (newValue: string) => {
        const formattedNewValue = formatDateFromHTML(newValue);
        setValue(formattedNewValue);
    }

    useEffect(() => {
        if (ctxDispatch) {
            ctxDispatch(name, value);
        }
    }, [value]);

  return (
    <TextField
      type="date"
      name={name}
      id={`fecha-input-${name}`}
      label={label}
      variant={variant}
      size={size}
      error={error}
      helperText={helperText}
      value={formatDateToHTML(value)}
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
}

export default FechaInput;
