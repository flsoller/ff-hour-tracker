import { TimeEntryMode } from "@hour-tracker/core-types/timelogs";
import type { TimeEntryFormState } from "../types";

/**
 * Convert hours and minutes to total seconds.
 */
export function hoursMinutesToSeconds(hours: number, minutes: number): number {
  return (hours * 60 + minutes) * 60;
}

/**
 * Convert seconds to hours and minutes components.
 */
export function secondsToHoursMinutes(seconds: number): {
  hours: number;
  minutes: number;
} {
  const totalMinutes = Math.floor(seconds / 60);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

/**
 * Convert ISO date string (and optional time string) to UTC timestamp.
 * @param date - Date in YYYY-MM-DD format
 * @param time - Optional time in HH:mm format
 * @returns Unix timestamp in milliseconds
 */
export function isoToTimestamp(date: string, time?: string): number {
  const dateParts = date.split("-").map(Number);
  const year = dateParts[0] ?? 0;
  const month = dateParts[1] ?? 1;
  const day = dateParts[2] ?? 1;

  if (time) {
    const timeParts = time.split(":").map(Number);
    const hours = timeParts[0] ?? 0;
    const minutes = timeParts[1] ?? 0;
    return Date.UTC(year, month - 1, day, hours, minutes);
  }
  return Date.UTC(year, month - 1, day);
}

/**
 * Get today's date as ISO string (YYYY-MM-DD).
 */
export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Initial form state with defaults.
 */
export function createInitialFormState(): TimeEntryFormState {
  const now = new Date();
  const todayISO = getTodayISO();

  return {
    mode: TimeEntryMode.DATE_TIME,
    activityTypeId: "",
    memberIds: [],
    notes: "",
    createMore: false,
    dateTime: {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
    hoursDay: {
      date: todayISO,
      hours: 0,
      minutes: 0,
    },
    hoursMonth: {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      hours: 0,
      minutes: 0,
    },
  };
}
