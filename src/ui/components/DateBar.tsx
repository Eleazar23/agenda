import { useRef } from "react";
import dayjs from "dayjs";
import {
  getCurrentDate,
  addDayToDate,
  subtractDayToDate,
  getDayName,
  getTargetDate,
  formatDateToHTML,
} from "../utils/utils";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useAgendaContext } from "../contexts/AgendaContext";
import type { Dayjs } from "dayjs";

export default function DateBar() {
  const { fecha, setFecha } = useAgendaContext();
  const now = getTargetDate(fecha);
  const wDay = getDayName(now.get("day"));
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  const updateDate = (newDate: string) => {
    setFecha(newDate);
  };

  const handlePrevDay = () => {
    updateDate(subtractDayToDate(fecha).format("DD-MM-YYYY"));
  };

  const handleToday = () => {
    updateDate(getCurrentDate().formattedDate);
  };

  const handleNextDay = () => {
    updateDate(addDayToDate(fecha).format("DD-MM-YYYY"));
  };

  const handleChangeDate = (newValue: Dayjs | null) => {
    if (newValue) {
      updateDate(newValue.format("DD-MM-YYYY"));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: "8px",
        pl: 0.5,
        pr: 1,
      }}
    >
      <Button
        size="small"
        onClick={handleToday}
        sx={{ color: "#fff", minWidth: "auto" }}
      >
        Hoy
      </Button>
      <IconButton size="small" onClick={handlePrevDay} sx={{ color: "#fff" }}>
        <ArrowBackIosNewOutlinedIcon fontSize="inherit" />
      </IconButton>
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Typography
          variant="body2"
          onClick={openDatePicker}
          sx={{
            color: "#fff",
            fontWeight: 500,
            whiteSpace: "nowrap",
            px: 0.5,
            cursor: "pointer",
          }}
        >
          {wDay} {fecha}
        </Typography>
        <Box
          component="input"
          ref={dateInputRef}
          type="date"
          aria-label="Seleccionar fecha"
          value={formatDateToHTML(fecha)}
          onChange={(e) => handleChangeDate(dayjs(e.target.value))}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            opacity: 0,
            pointerEvents: "none",
            border: "none",
            padding: 0,
          }}
        />
      </Box>
      <IconButton size="small" onClick={handleNextDay} sx={{ color: "#fff" }}>
        <ArrowForwardIosOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
