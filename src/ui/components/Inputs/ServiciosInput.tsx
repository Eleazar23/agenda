import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { Servicio } from "../../types/Servicio";
import { globalData } from "../../mock/globalData";
import { Box } from "@mui/material";

type Props = {
  serviceIndex?: number;
  value: Servicio | null;
  onChange: (newValue: Servicio | null) => void;
};

const styles = {
  textField: {
    "& .MuiInputBase-input": { textTransform: "capitalize" },
  },
};

// const options = [ // fix when mongo db working
//   "Corte de Cabello H",
//   "Corte de Cabello M",
//   "Tinte",
//   "Peinado",
// ];

export default function ServiciosInput({ value, onChange }: Props) {
  // const { servicios } = useAgendaContext();
  const [options, setOptions] = React.useState<Array<Servicio>>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event: any, newValue: Servicio | null) => {
    event.preventDefault();
    if (newValue) {
      onChange(newValue);
      console.log("Selected service:", newValue);
    }
  };

  const getServicios = () => {
    // Lógica para obtener los datos de los servicios
    console.log("Obteniendo datos de servicios...");
    setOptions([...globalData.servicios]);
    return globalData.servicios;
  };

  React.useEffect(() => {
    // Fetch services from backend API
    // fetch("http://localhost:5000/api/servicios")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const serviceNames = data.map((servicio: { nombre: string }) => servicio.nombre);
    //     setOptions(serviceNames);
    //   });
    getServicios();
  }, []);

  return (
    <Autocomplete<Servicio>
      getOptionLabel={(option) => option.nombre}
      options={options}
      fullWidth
      value={value }
      renderInput={(params) => (
        <TextField {...params} sx={styles.textField} label="Servicio" variant="filled" />
      )}
      onChange={handleChange}
      onInputChange={(event, newInputValue) => {
        console.log(event)
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={key} {...optionProps}>
            {option.nombre} - ${option.precio}
          </Box>
        );
      }}
    />
  );
}
