import React, { useMemo } from "react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { agGridTheme } from "../../theme/agGridTheme";
import { AG_GRID_LOCALE_ES } from "../../theme/agGridLocaleEs";
import { Box, IconButton, Popover, Stack, Typography } from "@mui/material";
import { ServicioAgendado } from "../../types/ServicioAgendado";
import { capitalizeFirstLetter, formatMoney } from "../../utils/utils";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  servicios: Array<ServicioAgendado> | [];
  onEditServicio?: (servicio: ServicioAgendado) => void;
  onDeleteServicio?: (servicio: ServicioAgendado) => void;
};

type AccionesCellRendererParams = {
  data: ServicioAgendado;
  onEditServicio?: (servicio: ServicioAgendado) => void;
  onDeleteServicio?: (servicio: ServicioAgendado) => void;
};

function AccionesCellRenderer({
  data,
  onEditServicio,
  onDeleteServicio,
}: AccionesCellRendererParams) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const isPopoverOpen = Boolean(anchorEl);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    onDeleteServicio?.(data);
    handleClosePopover();
  };

  return (
    <Stack direction="row" alignItems="center" height="100%">
      <EditBtn onClick={() => onEditServicio?.(data)} />
      <DeleteBtn onClick={handleDeleteClick} />
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Typography sx={{ p: 2 }}>
          ¿Estás seguro que deseas eliminar este servicio?
        </Typography>
        <Box display="flex" justifyContent="space-around" padding={1}>
          <IconButton color="primary" onClick={handleClosePopover}>
            No
          </IconButton>
          <IconButton color="error" onClick={handleConfirmDelete}>
            Sí
          </IconButton>
        </Box>
      </Popover>
    </Stack>
  );
}

function TotalServiciosTbl({
  servicios,
  onEditServicio,
  onDeleteServicio,
}: Props) {
  const colDefs = useMemo<Array<ColDef<ServicioAgendado>>>(
    () => [
      {
        field: "estilista",
        headerName: "Nombre del estilista",
        valueFormatter: (params) => capitalizeFirstLetter(params.value),
      },
      { field: "servicio.nombre", headerName: "Nombre del servicio" },
      {
        field: "servicio.precio",
        headerName: "Precio",
        valueFormatter: (params) => formatMoney(params.value),
      },
      { field: "horaInicio", headerName: "Hora de inicio" },
      { field: "horaFin", headerName: "Hora de fin" },
      {
        colId: "acciones",
        headerName: "Acciones",
        sortable: false,
        filter: false,
        cellRenderer: (params: { data: ServicioAgendado }) => (
          <AccionesCellRenderer
            data={params.data}
            onEditServicio={onEditServicio}
            onDeleteServicio={onDeleteServicio}
          />
        ),
      },
    ],
    [onEditServicio, onDeleteServicio],
  );

  return (
    <div style={{ height: 250 }}>
      <AgGridReact
        theme={agGridTheme}
        localeText={AG_GRID_LOCALE_ES}
        rowData={servicios}
        columnDefs={colDefs}
      />
    </div>
  );
}

export default TotalServiciosTbl;
