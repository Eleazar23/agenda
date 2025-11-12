import dayjs from "dayjs"
import objectSupport from 'dayjs/plugin/objectSupport'

export const hrs12f = [
"12:00 AM",
"12:30 AM",
"01:00 AM",
"01:30 AM",
"02:00 AM",
"02:30 AM",
"03:00 AM",
"03:30 AM",
"04:00 AM",
"04:30 AM",
"05:00 AM",
"05:30 AM",
"06:00 AM",
"06:30 AM",
"07:00 AM",
"07:30 AM",
"08:00 AM",
"08:30 AM",
"09:00 AM",
"09:30 AM",
"10:00 AM",
"10:30 AM",
"11:00 AM",
"11:30 AM",

"12:00 PM",
"12:30 PM",
"01:00 PM",
"01:30 PM",
"02:00 PM",
"02:30 PM",
"03:00 PM",
"03:30 PM",
"04:00 PM",
"04:30 PM",
"05:00 PM",
"05:30 PM",
"06:00 PM",
"06:30 PM",
"07:00 PM",
"07:30 PM",
"08:00 PM",
"08:30 PM",
"09:00 PM",
"09:30 PM",
"10:00 PM",
"10:30 PM",
"11:00 PM",
"11:30 PM",
]

export function capitalizeFirstLetter(str:string) {
  if (str.length === 0) {
    return ""; // Handle empty strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function getCurrentDate (dateString:string) {
    const today = dayjs()
    const cDate = dayjs(dateString)
    return {today, currenDate: cDate}
}

export const getHrs = () =>{
    let hour = 0
    let minute = 0
    let hrs = []

    while (hour < 24) {
        dayjs.extend(objectSupport)
        const cTime = dayjs({hour, minute})
        const label12 = cTime.format('hh:mm A')
        const label24 = cTime.format('HH:mm')
        // console.log({label12, label24})
        hrs.push({hour, minute, dateObject: cTime, label12, label24})
        if (minute >=30){
            minute = 0
            hour += 1
            continue
        }
        minute += 30
    }

    return hrs
}

// console.log(getHrs())