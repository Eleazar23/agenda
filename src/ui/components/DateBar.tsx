import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import {
  getCurrentDate,
  addDayToDate,
  subtractDayToDate,
  getDayName,
  getTargetDate,
} from "../utils/utils";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useAgendaContext } from "../contexts/AgendaContext";
import styled from "@emotion/styled";
import type { Dayjs } from "dayjs";

const StyledButton = styled(Button)({
  color: "#ffff",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
});

const styles = {
  dateBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffff",
  },
  textField: {
    width: "13rem",
    backgroundColor: "#ffff",
    borderRadius: ".5rem",
    height: "48px",
    "& .MuiPickersInputBase-root": {
      height: "48px",
    },
  },
  outlinedButton: {
    color: "#ffff",
    borderColor: "#ffff",
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
  },
};

export default function DateBar() {
  const { fecha, setFecha } = useAgendaContext();
  const now = getTargetDate(fecha);
  const today = now.get("date");
  const wDay = getDayName(now.get("day"));
  const month = now.get("month");
  const year = now.get("year");

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
    <Box sx={styles.dateBarContainer}>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="outlined"
          onClick={handleToday}
          sx={styles.outlinedButton}
        >
          Hoy
        </Button>
        <StyledButton onClick={handlePrevDay}>
          <ArrowBackIosOutlinedIcon />
        </StyledButton>
        <StyledButton onClick={handleNextDay}>
          <ArrowForwardIosOutlinedIcon />
        </StyledButton>
      </Box>
      <Typography
        variant="h6"
        sx={{ minWidth: "120px", textAlign: "center" }}
      >
        {wDay}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DatePicker
          views={["year", "month", "day"]}
          openTo="day"
          format={"DD/MM/YYYY"}
          defaultValue={dayjs(now).locale("es")}
          value={dayjs(now).locale("es")}
          slotProps={{ textField: { sx: styles.textField } }}
          onChange={handleChangeDate}
        />
      </LocalizationProvider>
    </Box>
  );
}
