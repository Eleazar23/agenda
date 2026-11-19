import { Box, IconButton, Stack, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { capitalizeFirstLetter } from "../../utils/utils";

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

const BORDER = "#edeef0";

const COLUMNS = {
  nombre: { flex: 2.2 },
  estilista: { flex: 1 },
  precio: { flex: 0.8, textAlign: "right" as const },
  cantidad: { flex: 1.1, textAlign: "center" as const },
  total: { flex: 0.9, textAlign: "right" as const },
  acciones: { width: 36, flexShrink: 0 },
};

const stepBtnSx = {
  width: 22,
  height: 22,
  borderRadius: 1.5,
  bgcolor: "#f3f4f6",
  color: "#5b6069",
  "&:hover": { bgcolor: "#e9ebee" },
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

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
    <Box
      sx={{ border: `1px solid ${BORDER}`, borderRadius: 2.5, overflow: "hidden" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          px: 1.75,
          py: 1.25,
          bgcolor: "#f8f9fb",
          fontSize: 11,
          letterSpacing: ".03em",
          color: "text.secondary",
          fontWeight: 700,
        }}
      >
        <Box sx={COLUMNS.nombre}>PRODUCTO</Box>
        <Box sx={COLUMNS.estilista}>ESTILISTA</Box>
        <Box sx={COLUMNS.precio}>PRECIO</Box>
        <Box sx={COLUMNS.cantidad}>CANTIDAD</Box>
        <Box sx={COLUMNS.total}>TOTAL</Box>
        <Box sx={COLUMNS.acciones} />
      </Stack>

      <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
        {products.map((product) => {
          const cantidad = Number(product.cantidad);
          return (
            <Stack
              key={product.id}
              direction="row"
              alignItems="center"
              sx={{ px: 1.75, py: 1.5, borderTop: `1px solid ${BORDER}` }}
            >
              <Typography sx={{ ...COLUMNS.nombre, fontSize: 13.5, fontWeight: 500 }}>
                {product.nombre}
              </Typography>
              <Typography
                sx={{ ...COLUMNS.estilista, fontSize: 13, color: "text.secondary" }}
              >
                {capitalizeFirstLetter(product.estilista || "")}
              </Typography>
              <Typography
                sx={{ ...COLUMNS.precio, fontSize: 13, color: "text.secondary" }}
              >
                {formatMoney(Number(product.precio))}
              </Typography>
              {/* Para dejarlo en 0 se usa la X de acciones */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={1.25}
                sx={COLUMNS.cantidad}
              >
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
              <Typography sx={{ ...COLUMNS.total, fontSize: 13.5, fontWeight: 700 }}>
                {formatMoney(Number(product.precio) * cantidad)}
              </Typography>
              <Box sx={{ ...COLUMNS.acciones, display: "flex", justifyContent: "center" }}>
                <IconButton
                  aria-label="quitar producto"
                  size="small"
                  disabled={disabled}
                  onClick={() => handleRemoveProducto(product.id)}
                  sx={{ color: "#b9bdc4", "&:hover": { color: "error.main" } }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Stack>
          );
        })}
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={1.25}
        sx={{ px: 1.75, py: 1.5, borderTop: `1px solid ${BORDER}`, bgcolor: "#f8f9fb" }}
      >
        <Typography
          sx={{ fontSize: 12.5, fontWeight: 600, color: "text.secondary" }}
        >
          TOTAL PRODUCTOS
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
          {formatMoney(totalProductos)}
        </Typography>
      </Stack>
    </Box>
  );
}

export default ProductsCar;
