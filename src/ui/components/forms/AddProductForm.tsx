import { useEffect, useState } from "react";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CantidadInput from "../Inputs/CantidadInput";
import { Producto } from "../../types/Producto";
import ProductInput from "../Inputs/ProductInput";
import EstilistaInput from "../Inputs/EstilistaInput";

type Props = {
  ctxAddProducto: ({
    producto,
    cantidad,
    estilista,
  }: {
    producto: Producto;
    cantidad: number;
    estilista: string;
  }) => boolean;
};

const initialFormData = {
  producto: {
    id: 0,
    nombre: "",
    marca: "",
    descripcion: "",
    precio: 0,
    stock: 0,
  },
  cantidad: 0,
  estilista: "",
};

function AddProductForm({ ctxAddProducto }: Props) {
  const [formData, setFormData] = useState<{
    producto: Producto;
    cantidad: number;
    estilista: string;
  }>(initialFormData);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCantidadChange = (value: number) => {
    const productoStock = formData.producto.stock || 0;
    let newValue = value;
    if (value > productoStock) {
      newValue = productoStock; // Limitar la cantidad al stock disponible o a 1 si es menor
    }
    handleChange("cantidad", newValue);
  };

  const handleAddProducto = () => {
    if (formData.producto.nombre && formData.cantidad > 0) {
      if (ctxAddProducto(formData)) {
        setFormData(prev => ({...prev, ...initialFormData})); // Reiniciar el formulario después de agregar el producto
      }
    }
  };

  return (
    <>
      <Grid container size={12} gap={1} justifyContent="flex-start">
        <Grid size={3}>
          <ProductInput
            value={formData.producto}
            onChange={(newValue) => handleChange("producto", newValue)}
          />
        </Grid>
        <Grid size={2}>
          <EstilistaInput
            ctxValue={formData?.estilista || ""}
            ctxDispatch={handleChange}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            label="Precio"
            name="precio"
            variant="filled"
            fullWidth
            value={formData.producto?.precio || ""}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            label="Stock"
            name="stock"
            variant="filled"
            fullWidth
            value={formData.producto?.stock || 0}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </Grid>
        <Grid size={1}>
          <CantidadInput
            variant="filled"
            ctxValue={formData.cantidad || 0}
            ctxOnChange={handleCantidadChange}
          />
        </Grid>
        <Grid size={1} display="flex" justifyContent="center">
          <IconButton
            aria-label="add-producto"
            color="success"
            size="medium"
            onClick={handleAddProducto}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}

export default AddProductForm;
