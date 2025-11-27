import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(objectSupport);
dayjs.extend(customParseFormat);

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return ""; // Handle empty strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCurrentDate() {
  const dateObj = dayjs();
  const day = dateObj.get("date");
  const month = dateObj.get("month");
  const year = dateObj.get("year");
  const formattedDate = dateObj.format("DD-MM-YYYY");
  return { dateObj, formattedDate, day, month, year };
}

export function getTargetDate(dateString: string) {
  const dateObj = dayjs(dateString, "DD-MM-YYYY");
  return dateObj;
}

export function addDayToDate(dateString: string) {
  const cDate = dayjs(dateString, "DD-MM-YYYY");
  const newDate = cDate.add(1, "day");
  return newDate;
}

export function formatDateToHTML(dateString: string) {
  const dateObj = dayjs(dateString, "DD-MM-YYYY");
  return dateObj.format("YYYY-MM-DD");
}

export function formatDateFromHTML(dateString: string) {
  const dateObj = dayjs(dateString, "YYYY-MM-DD");
  return dateObj.format("DD-MM-YYYY");
}

export function subtractDayToDate(dateString: string) {
  const cDate = dayjs(dateString, "DD-MM-YYYY");
  const newDate = cDate.subtract(1, "day");
  return newDate;
}

export const getHrs = () => {
  let hour = 0;
  let minute = 0;
  let hrs = [];

  while (hour < 24) {
    const cTime = dayjs({ hour, minute });
    const label12 = cTime.format("hh:mm A");
    const label24 = cTime.format("HH:mm");
    hrs.push({ hour, minute, dateObject: cTime, label12, label24 });
    if (minute >= 30) {
      minute = 0;
      hour += 1;
      continue;
    }
    minute += 30;
  }

  return hrs;
};

export function getMonthName(monthIndex: number) {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthNames[monthIndex] || "";
}

export function getDayName(dayIndex: number) {
  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dayNames[dayIndex] || "";
}
