/**
 * Entry modes available for time logging.
 * Each mode has different form fields and hour calculation logic.
 */
export const TimeEntryMode = {
  /** Date range with start/end times - hours calculated automatically */
  DATE_TIME: "date-time",
  /** Single date with manual hours input */
  HOURS_DAY: "hours-day",
  /** Month/year selection with total hours for the month */
  HOURS_MONTH: "hours-month",
} as const;

export type TimeEntryMode = (typeof TimeEntryMode)[keyof typeof TimeEntryMode];

/**
 * Entry type discriminator for storage and analytics.
 * Preserved to enable reporting by entry method.
 */
export const TimelogEntryType = {
  /** Created using date + start/end time */
  DATE_TIME: "date_time",
  /** Created using single date + hours */
  HOURS_DAY: "hours_day",
  /** Created using month + total hours */
  HOURS_MONTH: "hours_month",
} as const;

export type TimelogEntryType = (typeof TimelogEntryType)[keyof typeof TimelogEntryType];

/**
 * Metadata preserving original entry details for Date & Time mode.
 * Uses timestamps for storage/API compatibility.
 * Enables displaying "8:00 AM - 5:00 PM" vs just "9 hours".
 */
export interface DateTimeEntryMetadata {
  type: typeof TimelogEntryType.DATE_TIME;
  /** Full Unix timestamp (ms) - start date+time */
  startTimestamp: number;
  /** Full Unix timestamp (ms) - end date+time */
  endTimestamp: number;
}

/**
 * Metadata preserving original entry details for Hours/Day mode.
 */
export interface HoursDayEntryMetadata {
  type: typeof TimelogEntryType.HOURS_DAY;
  /** Unix timestamp (ms) at midnight UTC */
  date: number;
  /** Hour component of duration */
  hours: number;
  /** Minute component of duration */
  minutes: number;
}

/**
 * Metadata preserving original entry details for Hours/Month mode.
 */
export interface HoursMonthEntryMetadata {
  type: typeof TimelogEntryType.HOURS_MONTH;
  month: number;
  year: number;
  /** Hour component of duration */
  hours: number;
  /** Minute component of duration */
  minutes: number;
}

/**
 * Union type for entry metadata.
 * Discriminated by the type field.
 */
export type TimelogEntryMetadata =
  | DateTimeEntryMetadata
  | HoursDayEntryMetadata
  | HoursMonthEntryMetadata;

/**
 * Request payload for creating a single time log entry.
 * One entry is created per member (batch creates multiple requests).
 * Uses startTimestamp + durationSeconds pattern for all entry types.
 */
export interface ICreateTimelogReq {
  /** When work started/occurred - Unix timestamp (ms) */
  startTimestamp: number;

  /** Duration in seconds */
  durationSeconds: number;

  /** ID of the activity type */
  activityTypeId: string;

  /** ID of the team member */
  memberId: string;

  /** Optional notes/description */
  notes?: string;

  /** Entry type for analytics and reporting */
  entryType: TimelogEntryType;

  /** Original entry metadata - preserved for display/editing */
  entryMetadata: TimelogEntryMetadata;
}

/**
 * Batch creation request - sends multiple entries at once.
 * Used when multiple members are selected.
 */
export interface ICreateTimelogBatchReq {
  entries: ICreateTimelogReq[];
}

/**
 * Response for a successfully created time log.
 */
export interface ITimelogCreatedRes {
  id: string;
  memberId: string;
  memberName: string;
  durationSeconds: number;
  activityName: string;
  startTimestamp: number;
  entryType: TimelogEntryType;
}

/**
 * Batch creation response.
 */
export interface ICreateTimelogBatchRes {
  created: ITimelogCreatedRes[];
  failedCount: number;
}

/**
 * Stored timelog entity.
 */
export interface ITimelog {
  id: string;
  startTimestamp: number;
  durationSeconds: number;
  activityTypeId: string;
  orgId: string;
  memberId: string;
  entryType: TimelogEntryType;
  entryMetadata: TimelogEntryMetadata;
  notes?: string;
}
