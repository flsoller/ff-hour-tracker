<template>
  <div class="grid xs:grid-rows-3 sm:grid-cols-3 gap-1 rounded-lg border p-1">
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      :class="
        [
          'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          modelValue === mode.value
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ]
      "
      @click="emit('update:modelValue', mode.value)"
    >
      <component :is="mode.icon" class="h-4 w-4" />
      <span>{{ mode.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { TimeEntryMode } from "@hour-tracker/core-types/timelogs";
import { Calendar, CalendarDays, Clock } from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  modelValue: TimeEntryMode;
}>();

const emit = defineEmits<{
  "update:modelValue": [mode: TimeEntryMode];
}>();

const { t } = useI18n();

const modes = computed(() => [
  {
    value: TimeEntryMode.DATE_TIME,
    label: t("timeEntry.modes.dateTime"),
    icon: Clock,
  },
  {
    value: TimeEntryMode.HOURS_DAY,
    label: t("timeEntry.modes.hoursDay"),
    icon: Calendar,
  },
  {
    value: TimeEntryMode.HOURS_MONTH,
    label: t("timeEntry.modes.hoursMonth"),
    icon: CalendarDays,
  },
]);
</script>
