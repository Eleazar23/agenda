import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Propina } from "../../types/Cita";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { ProductoInCita } from "../../types/Producto";
import { useAgendaContext } from "../../contexts/AgendaContext";
import { capitalizeFirstLetter } from "../../utils/utils";

type Props = {
  propinas: Propina[];
  onChange: (propinas: Propina[]) => void;
  servicios: ServicioAgendado[];
  productos: ProductoInCita[];
  metodoDePagoDefault: string;
  totalCita: number;
};

const PORCENTAJES = [10, 15, 20];

const redondear = (monto: number) => Math.round(monto * 100) / 100;

const formatMonto = (monto: number) => `$${monto.toFixed(2)}`;

// Captura de propinas de una cita. Hay una fila por cada estilista que
// participó (servicios o productos) más las que se agreguen a mano para
// repartir con alguien que no hizo servicio. Las filas con monto 0 se
// mantienen en `propinas` mientras se edita; CitaModal las descarta al
// guardar.
function PropinasForm({
  propinas,
  onChange,
  servicios,
  productos,
  metodoDePagoDefault,
  totalCita,
}: Props) {
  const { estilistas } = useAgendaContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [propinaTotal, setPropinaTotal] = useState("");

  const subtotales = useMemo(() => {
    const acc = new Map<string, number>();
    servicios.forEach((s) => {
      acc.set(
        s.estilista,
        (acc.get(s.estilista) || 0) + Number(s.servicio.precio),
      );
    });
    productos.forEach((p) => {
      acc.set(
        p.estilista,
        (acc.get(p.estilista) || 0) + Number(p.precio) * Number(p.cantidad),
      );
    });
    return acc;
  }, [servicios, productos]);

  const filas = useMemo(() => {
    const nombres = [...subtotales.keys()];
    propinas.forEach((p) => {
      if (!nombres.includes(p.estilista)) nombres.push(p.estilista);
    });
    return nombres.map((estilista) => ({
      estilista,
      subtotal: subtotales.get(estilista) || 0,
      participo: subtotales.has(estilista),
      propina: propinas.find((p) => p.estilista === estilista),
    }));
  }, [subtotales, propinas]);

  const totalPropinas = useMemo(
    () => propinas.reduce((acc, p) => acc + Number(p.monto || 0), 0),
    [propinas],
  );

  const estilistasDisponibles = estilistas.filter(
    (e) => !filas.some((f) => f.estilista === e.name),
  );

  const updatePropina = (estilista: string, cambios: Partial<Propina>) => {
    const existe = propinas.some((p) => p.estilista === estilista);
    const nuevas = existe
      ? propinas.map((p) =>
          p.estilista === estilista ? { ...p, ...cambios } : p,
        )
      : [
          ...propinas,
          {
            estilista,
            monto: 0,
            metodoDePago: metodoDePagoDefault,
            ...cambios,
          },
        ];
    onChange(nuevas);
  };

  const handleMontoChange = (estilista: string, value: string) => {
    const monto = Math.max(0, Number(value) || 0);
    updatePropina(estilista, { monto });
  };

  const handleAgregarEstilista = (estilista: string) => {
    setAnchorEl(null);
    updatePropina(estilista, { monto: 0 });
  };

  const handleQuitarEstilista = (estilista: string) => {
    onChange(propinas.filter((p) => p.estilista !== estilista));
  };

  // Reparte el total en partes iguales entre las filas visibles; los
  // centavos que sobran por redondeo se le suman a la primera fila.
  const handleRepartir = () => {
    const total = Number(propinaTotal);
    if (!total || total <= 0 || filas.length === 0) return;
    const totalCentavos = Math.round(total * 100);
    const base = Math.floor(totalCentavos / filas.length);
    const sobrante = totalCentavos - base * filas.length;

    const nuevas = filas.map((fila, index) => ({
      estilista: fila.estilista,
      monto: (base + (index === 0 ? sobrante : 0)) / 100,
      metodoDePago: fila.propina?.metodoDePago || metodoDePagoDefault,
    }));
    onChange(nuevas);
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <TextField
            label="Propina total"
            size="small"
            type="number"
            value={propinaTotal}
            onChange={(e) => setPropinaTotal(e.target.value)}
            sx={{ width: 150 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
              htmlInput: { min: 0 },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleRepartir}
            disabled={!Number(propinaTotal) || filas.length === 0}
          >
            Repartir en partes iguales
          </Button>
          <Button
            size="small"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={estilistasDisponibles.length === 0}
          >
            Agregar estilista
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {estilistasDisponibles.map((e) => (
              <MenuItem
                key={e.id}
                onClick={() => handleAgregarEstilista(e.name)}
              >
                {capitalizeFirstLetter(e.name)}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>

      {filas.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          La cita no tiene estilistas asignadas.
        </Typography>
      )}

      {filas.map((fila) => (
        <Stack
          key={fila.estilista}
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {capitalizeFirstLetter(fila.estilista)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fila.participo
                ? `Subtotal ${formatMonto(fila.subtotal)}`
                : "Sin servicios en la cita"}
            </Typography>
          </Box>

          <Stack direction="row" gap={0.5}>
            {PORCENTAJES.map((pct) => (
              <Chip
                key={pct}
                label={`${pct}%`}
                size="small"
                variant="outlined"
                disabled={!fila.participo}
                onClick={() =>
                  updatePropina(fila.estilista, {
                    monto: redondear((fila.subtotal * pct) / 100),
                  })
                }
              />
            ))}
          </Stack>

          <TextField
            label="Monto"
            size="small"
            type="number"
            value={fila.propina?.monto || ""}
            onChange={(e) => handleMontoChange(fila.estilista, e.target.value)}
            sx={{ width: 130 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
              htmlInput: { min: 0 },
            }}
          />

          <ToggleButtonGroup
            size="small"
            exclusive
            value={fila.propina?.metodoDePago || metodoDePagoDefault}
            onChange={(_e, metodo: string | null) => {
              if (metodo) updatePropina(fila.estilista, { metodoDePago: metodo });
            }}
          >
            <ToggleButton value="efectivo">Efectivo</ToggleButton>
            <ToggleButton value="tarjeta">Tarjeta</ToggleButton>
          </ToggleButtonGroup>

          <Box flexGrow={1} />

          {!fila.participo && (
            <IconButton
              size="small"
              aria-label="Quitar estilista"
              onClick={() => handleQuitarEstilista(fila.estilista)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ))}

      <Divider />
      <Stack alignItems="flex-end" spacing={0.25}>
        <Typography variant="body1">
          Total cita: {formatMonto(totalCita)}
        </Typography>
        <Typography variant="body1" color="secondary.main">
          Propinas: + {formatMonto(totalPropinas)}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          Total a cobrar: {formatMonto(totalCita + totalPropinas)}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PropinasForm;
