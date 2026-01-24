/**
 * Time Entry Feature Types
 *
 * Frontend-specific types for the time entry feature.
 * Shared API types should be imported from @hour-tracker/core-types/timelogs.
 */

import type { TimeEntryMode } from "@hour-tracker/core-types/timelogs";

/**
 * Form data structure for Date & Time mode.
 * Used when user needs precise time tracking with start/end times.
 * All fields use ISO strings to match native HTML input formats.
 */
export interface DateTimeFormData {
  /** Start date in YYYY-MM-DD format (matches type="date" input) */
  startDate: string;
  /** End date in YYYY-MM-DD format (defaults to start date when start is selected) */
  endDate: string;
  /** Start time in HH:mm format (matches type="time" input) */
  startTime: string;
  /** End time in HH:mm format */
  endTime: string;
}

/**
 * Form data structure for Hours/Day mode.
 * Simple daily logging with manual hour entry.
 */
export interface HoursDayFormData {
  /** The date in YYYY-MM-DD format (matches type="date" input) */
  date: string;
  /** Hour component of duration (0-999) */
  hours: number;
  /** Minute component of duration (0-59) */
  minutes: number;
}

/**
 * Form data structure for Hours/Month mode.
 * Monthly aggregate time entry.
 */
export interface HoursMonthFormData {
  /** Selected month (1-12) */
  month: number;
  /** Selected year (current year +/- 5 years) */
  year: number;
  /** Hour component of duration (0-999) */
  hours: number;
  /** Minute component of duration (0-59) */
  minutes: number;
}

/**
 * Complete form state tracked by useTimeEntryForm composable.
 * Contains all fields across all modes plus common fields.
 */
export interface TimeEntryFormState {
  /** Currently selected entry mode */
  mode: TimeEntryMode;

  /** Selected activity type ID */
  activityTypeId: string;

  /** Array of selected member IDs (1 or more required) */
  memberIds: string[];

  /** Optional notes/description for the entry */
  notes: string;

  /** Whether to keep modal open after submission */
  createMore: boolean;

  /** Mode-specific fields - Date & Time mode */
  dateTime: DateTimeFormData;

  /** Mode-specific fields - Hours/Day mode */
  hoursDay: HoursDayFormData;

  /** Mode-specific fields - Hours/Month mode */
  hoursMonth: HoursMonthFormData;
}

/**
 * Simplified member type for selection.
 * Extracted from full IMember for use in multi-select.
 */
export interface SelectableMember {
  id: string;
  firstName: string;
  lastName: string;
  /** Computed full name for display */
  fullName: string;
}

/**
 * Simplified activity type for selection.
 * Extracted from full IActivityType for use in dropdown.
 */
export interface SelectableActivity {
  id: string;
  activityName: string;
  colorCode: string | null;
}

/**
 * Validation error structure.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result from form validation.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
