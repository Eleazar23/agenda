import { Box, IconButton, Stack, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { capitalizeFirstLetter, formatMoney } from "../../utils/utils";

type Props = {
  products: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    total: number;
    estilista: string;
  }[];
  handleRemoveProducto: (id: number) => void;
  handleCambiarCantidad: (id: number, cantidad: number) => void;
  disabled?: boolean;
};

const stepBtnSx = {
  width: 22,
  height: 22,
  borderRadius: 1.5,
  bgcolor: "#f3f4f6",
  color: "#5b6069",
  "&:hover": { bgcolor: "#e9ebee" },
};

function ProductsCar({
  products,
  handleRemoveProducto,
  handleCambiarCantidad,
  disabled,
}: Props) {
  // "total" no se guarda en BD (el esquema de Cita no lo tiene), así que se
  // calcula a partir de precio × cantidad.
  const totalProductos = products.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.cantidad),
    0,
  );

  return (
    <Stack spacing={1.25}>
      <Stack spacing={1} sx={{ maxHeight: 320, overflowY: "auto", pr: 0.25 }}>
        {products.map((product) => {
          const cantidad = Number(product.cantidad);
          const precio = Number(product.precio);
          const detalle = [
            product.estilista && capitalizeFirstLetter(product.estilista),
            `${formatMoney(precio)} c/u`,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <Stack
              key={product.id}
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                px: 1.5,
                py: 1.25,
                bgcolor: "background.paper",
                border: "1px solid #edeef0",
                borderRadius: 2.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 500 }}>
                  {product.nombre}
                </Typography>
                <Typography noWrap sx={{ fontSize: 12, color: "text.secondary" }}>
                  {detalle}
                </Typography>
              </Box>

              {/* Para dejarlo en 0 se usa la X */}
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <IconButton
                  aria-label="disminuir cantidad"
                  size="small"
                  disabled={disabled || cantidad <= 1}
                  onClick={() => handleCambiarCantidad(product.id, cantidad - 1)}
                  sx={stepBtnSx}
                >
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, minWidth: 14, textAlign: "center" }}
                >
                  {cantidad}
                </Typography>
                <IconButton
                  aria-label="aumentar cantidad"
                  size="small"
                  disabled={disabled}
                  onClick={() => handleCambiarCantidad(product.id, cantidad + 1)}
                  sx={stepBtnSx}
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>

              <Typography
                sx={{ width: 68, textAlign: "right", fontSize: 13.5, fontWeight: 700 }}
              >
                {formatMoney(precio * cantidad)}
              </Typography>

              <IconButton
                aria-label="quitar producto"
                size="small"
                disabled={disabled}
                onClick={() => handleRemoveProducto(product.id)}
                sx={{ color: "#b9bdc4", "&:hover": { color: "error.main" } }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 1.25, borderTop: "1px solid #e3e5e8" }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
          TOTAL PRODUCTOS
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
          {formatMoney(totalProductos)}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default ProductsCar;
