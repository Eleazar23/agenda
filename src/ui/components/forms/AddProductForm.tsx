import { Autocomplete, Grid, IconButton, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CantidadInput from "../Inputs/Cantidad";

function AddProductForm() {
  return (
    <>
      <Grid size={10} display="flex" gap={2} justifyContent="flex-end">
        <Autocomplete
          id="controlled-NombreProducto"
          fullWidth
          value={"Shampoo"}
          options={[]}
          onChange={(event: any, newValue: string | null) => {
            console.log(event.target.value, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nombre del producto"
              variant="filled"
            />
          )}
        />
        <CantidadInput variant="filled" ctxOnChange={(value) => console.log(value)} />
      </Grid>
      <Grid size={2} display="flex" justifyContent="center">
        <IconButton aria-label="add-producto" color="success" size="medium">
          <AddCircleOutlineIcon />
        </IconButton>
      </Grid>
    </>
  );
}

export default AddProductForm;
