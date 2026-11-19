import { useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Producto } from "../../types/Producto";
import ProductInput from "../Inputs/ProductInput";
import EstilistaInput from "../Inputs/EstilistaInput";
import FieldLabel from "../Inputs/FieldLabel";
import {
  COMPACT_FIELD_HEIGHT as FIELD_HEIGHT,
  compactFieldSx,
} from "../../utils/compactFieldSx";

type Props = {
  ctxAddProducto: ({
    producto,
    cantidad,
    estilista,
  }: {
    producto: Producto;
    cantidad: number;
    estilista: string;
  }) => Promise<boolean>;
};

const getInitialFormData = () => ({
  producto: {
    id: 0,
    nombre: "",
    marca: "",
    descripcion: "",
    precio: 0,
    stock: 0,
  },
  cantidad: 1,
  estilista: "",
});

function Dot() {
  return (
    <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "divider" }} />
  );
}

function AddProductForm({ ctxAddProducto }: Props) {
  const [formData, setFormData] = useState<{
    producto: Producto;
    cantidad: number;
    estilista: string;
  }>(getInitialFormData);
  const [isGuardando, setIsGuardando] = useState(false);

  const hayProducto = !!formData.producto.nombre;
  const stock = formData.producto.stock || 0;

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductoChange = (newValue: Producto | null) => {
    const producto = newValue || getInitialFormData().producto;
    const productoStock = producto.stock || 0;
    setFormData((prev) => ({
      ...prev,
      producto,
      cantidad: Math.min(Math.max(prev.cantidad, 1), productoStock || 1),
    }));
  };

  const handleCantidadChange = (delta: number) => {
    setFormData((prev) => {
      const nextStock = prev.producto.stock || 0;
      const nextValue = Math.min(nextStock, Math.max(1, prev.cantidad + delta));
      return { ...prev, cantidad: nextValue };
    });
  };

  const handleAddProducto = async () => {
    if (
      isGuardando ||
      !formData.producto.nombre ||
      !formData.estilista ||
      formData.cantidad <= 0
    ) {
      return;
    }
    setIsGuardando(true);
    try {
      if (await ctxAddProducto(formData)) {
        setFormData(getInitialFormData());
      }
    } finally {
      setIsGuardando(false);
    }
  };

  const subtotal = hayProducto
    ? (Number(formData.producto.precio) * formData.cantidad).toFixed(2)
    : "0.00";

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="flex-end" gap={2.25}>
        <Box sx={{ flex: 1.8, minWidth: 0 }}>
          <FieldLabel>Producto</FieldLabel>
          <ProductInput
            value={formData.producto}
            onChange={handleProductoChange}
            variant="outlined"
            size="small"
            hideLabel
            sx={compactFieldSx}
          />
        </Box>

        <Box>
          <FieldLabel>Cantidad</FieldLabel>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              border: "1.5px solid",
              borderColor: hayProducto ? "primary.main" : "#e3e5e8",
              borderRadius: 2,
              height: FIELD_HEIGHT,
              boxSizing: "border-box",
              bgcolor: hayProducto ? "background.paper" : "#fafafa",
            }}
          >
            <IconButton
              aria-label="disminuir cantidad"
              size="small"
              color="primary"
              disabled={!hayProducto || formData.cantidad <= 1}
              onClick={() => handleCantidadChange(-1)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                minWidth: 28,
                textAlign: "center",
                fontWeight: 700,
                fontSize: 14,
                color: hayProducto ? "text.primary" : "text.disabled",
              }}
            >
              {formData.cantidad}
            </Typography>
            <IconButton
              aria-label="aumentar cantidad"
              size="small"
              color="primary"
              disabled={!hayProducto || formData.cantidad >= stock}
              onClick={() => handleCantidadChange(1)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{ width: "1px", height: 46, bgcolor: "#e3e5e8", flexShrink: 0 }}
        />

        <Box sx={{ width: 200, flexShrink: 0 }}>
          <FieldLabel>Para (estilista)</FieldLabel>
          <EstilistaInput
            ctxValue={formData?.estilista || ""}
            ctxDispatch={handleChange}
            autoSelectFirst={false}
            variant="outlined"
            size="small"
            hideLabel
            sx={compactFieldSx}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProducto}
          disabled={isGuardando || !hayProducto || !formData.estilista}
          sx={{
            height: FIELD_HEIGHT,
            px: 2.5,
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          Agregar
        </Button>
      </Stack>

      {hayProducto && (
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12.5 }}>
            Precio unitario{" "}
            <Box component="b" sx={{ color: "text.primary" }}>
              ${Number(formData.producto.precio).toFixed(2)}
            </Box>
          </Typography>
          <Dot />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12.5 }}>
            Stock disponible{" "}
            <Box component="b" sx={{ color: "text.primary" }}>
              {stock}
            </Box>
          </Typography>
          <Dot />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12.5 }}>
            Subtotal{" "}
            <Box component="b" sx={{ color: "success.main" }}>
              ${subtotal}
            </Box>
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default AddProductForm;
