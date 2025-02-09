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
            acc[j % 7].push(day);
          }
        }
        // Add day
        const columnIndex = (i + sparePreviousDays) % 7;
        acc[columnIndex].push(day);

        // Add bookend
        if (day === daysInMonth) {
          for (let k = 1; k <= spareNextDays; k++) {
            const columnIndex =(i + sparePreviousDays + k) % 7;
            acc[columnIndex].push(k);
          }
        }
        if (acc[acc.length - 1].length === 5 && day === daysInMonth) {
            for (let k = 0; k < 7; k++) {
                acc[k].push(k + spareNextDays + 1);
            }
        }
        return acc;
      }, [...Array.from({ length: 7 }).map(() => [] as number[])]);

    data.push([month.startOf("month").format(dayFormat), days]);
  }

  return data.reverse();
};
