import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import VacacionesModal from "../modals/VacacionesModal";
import { getCurrentDate, getTargetDate } from "../../utils/utils";

function VacacionesCell(params: CustomCellRendererProps) {
  const [isOpen, setIsOpen] = useState(false);
  const vacaciones = params.data?.vacaciones || [];

  // Próxima vacación: la que esté en curso o la más cercana en el futuro
  // (fin todavía no ha pasado), ordenadas por fecha de inicio.
  const proximaVacacion = useMemo(() => {
    const hoy = getTargetDate(getCurrentDate().formattedDate).valueOf();
    return [...vacaciones]
      .filter((v: { inicio: string; fin: string }) => getTargetDate(v.fin).valueOf() >= hoy)
      .sort(
        (a: { inicio: string }, b: { inicio: string }) =>
          getTargetDate(a.inicio).valueOf() - getTargetDate(b.inicio).valueOf(),
      )[0];
  }, [vacaciones]);

  // Solo cambia el separador para mostrar la fecha (DD/MM/YYYY); el formato
  // interno DD-MM-YYYY que usa el resto de la app no se toca.
  const conBarras = (fecha: string) => fecha.replace(/-/g, "/");

  return (
    <>
      <Box
        sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => setIsOpen(true)}
      >
        {proximaVacacion ? (
          <Typography variant="body2">
            {conBarras(proximaVacacion.inicio)} — {conBarras(proximaVacacion.fin)}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Sin vacaciones
          </Typography>
        )}
      </Box>
      <VacacionesModal
        rowIndex={params.node?.rowIndex ?? -1}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        estilistaData={params.data}
      />
    </>
  );
}

export default VacacionesCell;
