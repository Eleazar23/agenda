
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAgendaContext } from "../../contexts/AgendaContext";

type Props = {
  serviceIndex: number
  ctxValue?: number
  ctxDispatch?: React.Dispatch<React.SetStateAction<any>>
  readonly?: boolean
};

export default function DuracionInput({serviceIndex, ctxValue, ctxDispatch, readonly}:Props) {
  const {updateDuracion} = useAgendaContext()
  const minValue = "30";
  const [value, setValue] = useState(minValue);

  const roundNumber = (newValue:any) => {
      const diff = newValue % Number(minValue);
      const minNew = newValue - diff;
      const maxNew = (minNew * 2) - newValue;
      const roundedNumb = [minNew, maxNew]

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const intNewValue = Number(newValue);
    const isValidNumber = intNewValue % Number(minValue) === 0
    setValue(newValue);

    setTimeout(() => {
      const diff = intNewValue % Number(minValue);
      const minNew = intNewValue - diff;
      const maxNew = minNew * 2;
      // console.log("Module: ", intNewValue % 30);
      if (intNewValue < 30) {
        return setValue(minValue);
      }
      if (!isValidNumber){
        roundNumber(intNewValue)
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
