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

export const getOfficeHours = () => {
  const allDayHrs = getHrs();
  const officeStart = "09:00";
  const officeEnd = "20:00";
  const officeHrs = allDayHrs.filter(
    (hr) => hr.label24 >= officeStart && hr.label24 <= officeEnd,
  );

  const indexedHrs = officeHrs.map((hr, index) => ({ ...hr, index }));
  return indexedHrs;

}

const hrsObj = {
  "00:00": { index: 0, label12: "12:00 AM", label24: "00:00", value: "00:00" },
  "00:30": { index: 1, label12: "12:30 AM", label24: "00:30", value: "00:30" },
  "01:00": { index: 2, label12: "01:00 AM", label24: "01:00", value: "01:00" },
  "01:30": { index: 3, label12: "01:30 AM", label24: "01:30", value: "01:30" },
  "02:00": { index: 4, label12: "02:00 AM", label24: "02:00", value: "02:00" },
  "02:30": { index: 5, label12: "02:30 AM", label24: "02:30", value: "02:30" },
  "03:00": { index: 6, label12: "03:00 AM", label24: "03:00", value: "03:00" },
  "03:30": { index: 7, label12: "03:30 AM", label24: "03:30", value: "03:30" },
  "04:00": { index: 8, label12: "04:00 AM", label24: "04:00", value: "04:00" },
  "04:30": { index: 9, label12: "04:30 AM", label24: "04:30", value: "04:30" },
  "05:00": { index: 10, label12: "05:00 AM", label24: "05:00", value: "05:00" },
  "05:30": { index: 11, label12: "05:30 AM", label24: "05:30", value: "05:30" },
  "06:00": { index: 12, label12: "06:00 AM", label24: "06:00", value: "06:00" },
  "06:30": { index: 13, label12: "06:30 AM", label24: "06:30", value: "06:30" },
  "07:00": { index: 14, label12: "07:00 AM", label24: "07:00", value: "07:00" },
  "07:30": { index: 15, label12: "07:30 AM", label24: "07:30", value: "07:30" },
  "08:00": { index: 16, label12: "08:00 AM", label24: "08:00", value: "08:00" },
  "08:30": { index: 17, label12: "08:30 AM", label24: "08:30", value: "08:30" },
  "09:00": { index: 18, label12: "09:00 AM", label24: "09:00", value: "09:00" },
  "09:30": { index: 19, label12: "09:30 AM", label24: "09:30", value: "09:30" },
  "10:00": { index: 20, label12: "10:00 AM", label24: "10:00", value: "10:00" },
  "10:30": { index: 21, label12: "10:30 AM", label24: "10:30", value: "10:30" },
  "11:00": { index: 22, label12: "11:00 AM", label24: "11:00", value: "11:00" },
  "11:30": { index: 23, label12: "11:30 AM", label24: "11:30", value: "11:30" },
  "12:00": { index: 24, label12: "12:00 PM", label24: "12:00", value: "12:00" },
  "12:30": { index: 25, label12: "12:30 PM", label24: "12:30", value: "12:30" },
  "13:00": { index: 26, label12: "01:00 PM", label24: "13:00", value: "13:00" },
  "13:30": { index: 27, label12: "01:30 PM", label24: "13:30", value: "13:30" },
  "14:00": { index: 28, label12: "02:00 PM", label24: "14:00", value: "14:00" },
  "14:30": { index: 29, label12: "02:30 PM", label24: "14:30", value: "14:30" },
  "15:00": { index: 30, label12: "03:00 PM", label24: "15:00", value: "15:00" },
  "15:30": { index: 31, label12: "03:30 PM", label24: "15:30", value: "15:30" },
  "16:00": { index: 32, label12: "04:00 PM", label24: "16:00", value: "16:00" },
  "16:30": { index: 33, label12: "04:30 PM", label24: "16:30", value: "16:30" },
  "17:00": { index: 34, label12: "05:00 PM", label24: "17:00", value: "17:00" },
  "17:30": { index: 35, label12: "05:30 PM", label24: "17:30", value: "17:30" },
  "18:00": { index: 36, label12: "06:00 PM", label24: "18:00", value: "18:00" },
  "18:30": { index: 37, label12: "06:30 PM", label24: "18:30", value: "18:30" },
  "19:00": { index: 38, label12: "07:00 PM", label24: "19:00", value: "19:00" },
  "19:30": { index: 39, label12: "07:30 PM", label24: "19:30", value: "19:30" },
  "20:00": { index: 40, label12: "08:00 PM", label24: "20:00", value: "20:00" },
  "20:30": { index: 41, label12: "08:30 PM", label24: "20:30", value: "20:30" },
  "21:00": { index: 42, label12: "09:00 PM", label24: "21:00", value: "21:00" },
  "21:30": { index: 43, label12: "09:30 PM", label24: "21:30", value: "21:30" },
  "22:00": { index: 44, label12: "10:00 PM", label24: "22:00", value: "22:00" },
  "22:30": { index: 45, label12: "10:30 PM", label24: "22:30", value: "22:30" },
  "23:00": { index: 46, label12: "11:00 PM", label24: "23:00", value: "23:00" },
  "23:30": { index: 47, label12: "11:30 PM", label24: "23:30", value: "23:30" },
};

export const getHrsObj = (hourValue: string) => {
  return hrsObj[hourValue as keyof typeof hrsObj];
};

const formatHoraFin = (hora: string) => {
  const hrFinArry = hora.split(" ");
  return hrFinArry[0];
};

export const getDuracion = (horaInicio: string, horaFin: string) => {
  const formattedHoraFin = formatHoraFin(horaFin);
  const [startHrs, startMins] = horaInicio.split(":").map(Number);
  const [endHrs, endMins] = formattedHoraFin.split(":").map(Number);
  const startTotalMins = startHrs * 60 + startMins;
  const endTotalMins = endHrs * 60 + endMins;
  const diffMins = endTotalMins - startTotalMins;
  const realDiffMins = diffMins >= 0 ? diffMins : 0;
  console.log("Duracion actualizada a:", diffMins);
  return realDiffMins;
};

export function throttle(func: any, limit: number) {
  let inThrottle = false;
  return function (this: any) {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
