import { type ICreateTimelogReq, TimeEntryMode, TimelogEntryType } from "@hour-tracker/core-types/timelogs";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { TimeEntryFormState, ValidationError, ValidationResult } from "../types";
import { createInitialFormState, getTodayISO, hoursMinutesToSeconds, isoToTimestamp } from "../utils";

/**
 * Composable for managing time entry form state, validation, and request building.
 *
 * Handles:
 * - Form state management across all three entry modes
 * - Mode switching
 * - Validation for each mode
 * - Duration calculation for Date & Time mode
 * - Building API request payloads (one per selected member)
 * - Form reset logic (full reset and "create more" reset)
 */
export function useTimeEntryForm() {
  const { t } = useI18n();
  const formState = reactive<TimeEntryFormState>(createInitialFormState());
  const currentMode = computed(() => formState.mode);
  const errors = ref<ValidationError[]>([]);
  const isSubmitting = ref(false);

  /**
   * Calculated duration in seconds for Date & Time mode.
   * Returns null if any required field is missing or if the result is invalid.
   */
  const calculatedDurationSeconds = computed<number | null>(() => {
    if (formState.mode !== TimeEntryMode.DATE_TIME) return null;

    const { startDate, startTime, endDate, endTime } = formState.dateTime;
    if (!startDate || !startTime || !endDate || !endTime) return null;

    const startTs = isoToTimestamp(startDate, startTime);
    const endTs = isoToTimestamp(endDate, endTime);
    const diffMs = endTs - startTs;

    return diffMs > 0 ? Math.floor(diffMs / 1000) : null;
  });

  /**
   * Whether the form is currently valid.
   */
  const isValid = computed(() => {
    const result = validate();
    return result.isValid;
  });

  /**
   * Switch to a different entry mode.
   */
  function setMode(mode: TimeEntryMode): void {
    formState.mode = mode;
    errors.value = [];
  }

  /**
   * Validate the entire form based on current mode.
   * Returns validation result and updates errors ref.
   */
  function validate(): ValidationResult {
    const validationErrors: ValidationError[] = [];

    // Common validations
    if (!formState.activityTypeId) {
      validationErrors.push({
        field: "activityTypeId",
        message: t("timeEntry.validation.activityRequired"),
      });
    }

    if (formState.memberIds.length === 0) {
      validationErrors.push({
        field: "memberIds",
        message: t("timeEntry.validation.memberRequired"),
      });
    }

    // Mode-specific validations
    switch (formState.mode) {
      case TimeEntryMode.DATE_TIME:
        if (!formState.dateTime.startDate) {
          validationErrors.push({
            field: "startDate",
            message: t("timeEntry.validation.startDateRequired"),
          });
        }
        if (!formState.dateTime.endDate) {
          validationErrors.push({
            field: "endDate",
            message: t("timeEntry.validation.endDateRequired"),
          });
        }
        if (!formState.dateTime.startTime) {
          validationErrors.push({
            field: "startTime",
            message: t("timeEntry.validation.startTimeRequired"),
          });
        }
        if (!formState.dateTime.endTime) {
          validationErrors.push({
            field: "endTime",
            message: t("timeEntry.validation.endTimeRequired"),
          });
        }
        // Check that calculated duration is positive
        if (
          formState.dateTime.startDate
          && formState.dateTime.endDate
          && formState.dateTime.startTime
          && formState.dateTime.endTime
          && (calculatedDurationSeconds.value === null
            || calculatedDurationSeconds.value <= 0)
        ) {
          validationErrors.push({
            field: "endTime",
            message: t("timeEntry.validation.endTimeMustBeAfterStart"),
          });
        }
        break;

      case TimeEntryMode.HOURS_DAY:
        if (!formState.hoursDay.date) {
          validationErrors.push({
            field: "date",
            message: t("timeEntry.validation.dateRequired"),
          });
        }
        if (
          formState.hoursDay.hours <= 0
          && formState.hoursDay.minutes <= 0
        ) {
          validationErrors.push({
            field: "hours",
            message: t("timeEntry.validation.durationRequired"),
          });
        }
        break;

      case TimeEntryMode.HOURS_MONTH:
        if (
          formState.hoursMonth.hours <= 0
          && formState.hoursMonth.minutes <= 0
        ) {
          validationErrors.push({
            field: "hours",
            message: t("timeEntry.validation.durationRequired"),
          });
        }
        break;
    }

    errors.value = validationErrors;
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  }

  /**
   * Get error message for a specific field.
   */
  function getFieldError(field: string): string | undefined {
    return errors.value.find((e) => e.field === field)?.message;
  }

  /**
   * Check if a specific field has an error.
   */
  function hasFieldError(field: string): boolean {
    return errors.value.some((e) => e.field === field);
  }

  /**
   * Build base request data (without memberId) based on current mode.
   */
  function buildBaseRequestData(): Omit<ICreateTimelogReq, "memberId"> {
    const baseData = {
      activityTypeId: formState.activityTypeId,
      notes: formState.notes || undefined,
    };

    switch (formState.mode) {
      case TimeEntryMode.DATE_TIME: {
        const startTs = isoToTimestamp(
          formState.dateTime.startDate,
          formState.dateTime.startTime,
        );
        const endTs = isoToTimestamp(
          formState.dateTime.endDate,
          formState.dateTime.endTime,
        );
        return {
          ...baseData,
          startTimestamp: startTs,
          durationSeconds: calculatedDurationSeconds.value!,
          entryType: TimelogEntryType.DATE_TIME,
          entryMetadata: {
            type: TimelogEntryType.DATE_TIME,
            startTimestamp: startTs,
            endTimestamp: endTs,
          },
        };
      }

      case TimeEntryMode.HOURS_DAY: {
        const dateTs = isoToTimestamp(formState.hoursDay.date);
        return {
          ...baseData,
          startTimestamp: dateTs,
          durationSeconds: hoursMinutesToSeconds(
            formState.hoursDay.hours,
            formState.hoursDay.minutes,
          ),
          entryType: TimelogEntryType.HOURS_DAY,
          entryMetadata: {
            type: TimelogEntryType.HOURS_DAY,
            date: dateTs,
            hours: formState.hoursDay.hours,
            minutes: formState.hoursDay.minutes,
          },
        };
      }

      case TimeEntryMode.HOURS_MONTH: {
        // Use first day of the month as the normalized timestamp
        const monthTs = Date.UTC(
          formState.hoursMonth.year,
          formState.hoursMonth.month - 1,
          1,
        );
        return {
          ...baseData,
          startTimestamp: monthTs,
          durationSeconds: hoursMinutesToSeconds(
            formState.hoursMonth.hours,
            formState.hoursMonth.minutes,
          ),
          entryType: TimelogEntryType.HOURS_MONTH,
          entryMetadata: {
            type: TimelogEntryType.HOURS_MONTH,
            month: formState.hoursMonth.month,
            year: formState.hoursMonth.year,
            hours: formState.hoursMonth.hours,
            minutes: formState.hoursMonth.minutes,
          },
        };
      }
    }
  }

  /**
   * Build API request payloads - one per selected member.
   * Should only be called after validation passes.
   */
  function buildRequests(): ICreateTimelogReq[] {
    const baseData = buildBaseRequestData();

    return formState.memberIds.map((memberId) => ({
      ...baseData,
      memberId,
    }));
  }

  /**
   * Reset form to initial state.
   */
  function resetForm(): void {
    const initial = createInitialFormState();
    Object.assign(formState, initial);
    errors.value = [];
  }

  /**
   * Reset for "create more" flow.
   * Keeps mode and activity type, clears time/date/member/notes fields.
   */
  function resetForCreateMore(): void {
    const now = new Date();
    const todayISO = getTodayISO();

    // Keep mode, activityTypeId, and createMore
    const preservedMode = formState.mode;
    const preservedActivityTypeId = formState.activityTypeId;

    // Reset mode-specific data
    formState.dateTime = {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    };
    formState.hoursDay = {
      date: todayISO,
      hours: 0,
      minutes: 0,
    };
    formState.hoursMonth = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      hours: 0,
      minutes: 0,
    };

    // Reset common fields except mode and activity
    formState.memberIds = [];
    formState.notes = "";

    // Restore preserved values
    formState.mode = preservedMode;
    formState.activityTypeId = preservedActivityTypeId;

    // Clear errors
    errors.value = [];
  }

  return {
    // State
    formState,
    currentMode,
    isValid,
    errors,
    isSubmitting,
    calculatedDurationSeconds,

    // Actions
    setMode,
    validate,
    getFieldError,
    hasFieldError,
    buildRequests,
    resetForm,
    resetForCreateMore,
  };
}

export type UseTimeEntryFormReturn = ReturnType<typeof useTimeEntryForm>;
