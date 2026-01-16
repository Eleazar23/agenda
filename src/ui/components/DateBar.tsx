import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  getCurrentDate,
  addDayToDate,
  subtractDayToDate,
  getDayName,
  getTargetDate,
} from "../utils/utils";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Height } from "@mui/icons-material";
import { useAgendaContext } from "../contexts/AgendaContext";
import styled from "@emotion/styled";

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
  // const now = dayjs()
  const { dateObj, formattedDate } = getCurrentDate();
  const { agendaData, setAgendaData } = useAgendaContext();
  const { fecha } = agendaData;

  const nextday = addDayToDate(dateObj.format("DD-MM-YYYY"));
  const prevday = subtractDayToDate(dateObj.format("DD-MM-YYYY"));
  const now = getTargetDate(fecha);
  const today = now.get("date");
  const wDay = getDayName(now.get("day"));
  const month = now.get("month");
  const year = now.get("year");
  // console.log({ today, month, year, nextday, prevday, dateObj, wDay });

  const handlePrevDay = () => {
    const newDate = subtractDayToDate(fecha);
    setAgendaData({
      ...agendaData,
      fecha: newDate.format("DD-MM-YYYY"),
    });
  };

  const handleToday = () => {
    const { formattedDate } = getCurrentDate();
    setAgendaData({
      ...agendaData,
      fecha: formattedDate,
    });
  };

  const handleNextDay = () => {
    const newDate = addDayToDate(fecha);
    setAgendaData({
      ...agendaData,
      fecha: newDate.format("DD-MM-YYYY"),
    });
  };

  const handleChangeDate = (newValue: any) => {
    if (newValue) {
      const selectedDate = newValue.format("DD-MM-YYYY");
      setAgendaData({
        ...agendaData,
        fecha: selectedDate,
      });
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
        sx={{ minWidth: "120px", textAlign: "center", textTransform: "none" }}
      >
        {`${wDay}`}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={["year", "month", "day"]}
          openTo="day"
          format={"MMMM DD, YYYY"}
          defaultValue={now}
          value={now}
          slotProps={{ textField: { sx: styles.textField } }}
          onChange={handleChangeDate}
        />
      </LocalizationProvider>
    </Box>
  );
}
