import dayjs from "dayjs";
import { dayFormat } from "@constants/formats";

// Function to generate calendar data
export const generateCalendarData = (userInception: string) => {
  const numMonths = Math.max(2, dayjs().diff(dayjs(userInception), "month"));
  const data = [] as Array<[string, number[][]]>;

  for (let i = 0; i < numMonths; i++) {
    const month = dayjs().subtract(i, "month");

    const daysInMonth = month.daysInMonth();
    const sparePreviousDays = month.startOf("month").day();
    const spareNextDays = 7 - month.endOf("month").day() - 1;
    const previousDaysInMonth = month.subtract(1, "month").daysInMonth();

    // prettier-ignore
    const days = Array.from({ length: daysInMonth })
      .map((_, i) => i + 1)
      .reduce((acc, day, i) => {
        // Add bookstart
        if (i === 0) {
          for (let j = 0; j < sparePreviousDays; j++) {
            const day = previousDaysInMonth - sparePreviousDays + j + 1;
            acc.push(day);
          }
        }
        // Add day
        acc.push(day);

        // Add bookend
        if (day === daysInMonth) {
          for (let k = 1; k <= spareNextDays; k++) {
            acc.push(k);
          }
        }
        return acc;
      }, [] as number[]);

    if (days.length / 7 < 6) {
      for (let k = 0; k < 7; k++) {
        days.push(k + spareNextDays + 1);
      }
    }

    // Group days into rows of 7
    const groupedDays = days.reduce((acc, day, i) => {
      const rowIndex = Math.floor(i / 7);
      acc[rowIndex] = [...(acc[rowIndex] || []), day];
      return acc;
    }, [] as number[][]);

    data.push([month.startOf("month").format(dayFormat), groupedDays]);
  }

  return data.reverse();
};
