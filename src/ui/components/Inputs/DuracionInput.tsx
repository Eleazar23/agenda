
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  serviceIndex: number
  ctxValue?: number
  ctxDispatch?: React.Dispatch<React.SetStateAction<number>>
  readonly?: boolean
};

export default function DuracionInput({ ctxValue, ctxDispatch, readonly }: Props) {
  const minValue = "30";
  const [value, setValue] = useState(minValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const intNewValue = Number(newValue);
    setValue(newValue);

    setTimeout(() => {
      if (intNewValue < 30) {
        return setValue(minValue);
      }
    }, 500);
  };

  useEffect(()=>{
    if (ctxDispatch){
      ctxDispatch(Number(value))
    }
    // } else {
    //   updateDuracion(serviceIndex, Number(value))
    // }
  }, [value])

  return (
    <>
      <TextField
        type="number"
        variant="filled"
        label="Duracion"
        slotProps={{ htmlInput: { step: "30", min: "30" } }}
        // defaultValue={"30"}
        fullWidth
        disabled={readonly}
        onChange={handleChange}
        value={ctxValue || value}
      />
    </>
  );
}
