<template>
  <div class="space-y-4">
    <!-- Start Date -->
    <div class="space-y-2">
      <Label>{{ t("timeEntry.fields.startDate") }}</Label>
      <Input v-model="startDateModel" type="date" class="bg-muted/50" />
    </div>
    <!-- End Date -->
    <div class="space-y-2">
      <Label>{{ t("timeEntry.fields.endDate") }}</Label>
      <Input
        v-model="endDateModel"
        type="date"
        :min="modelValue.startDate"
        class="bg-muted/50"
      />
    </div>

    <!-- Time inputs - responsive: stack on mobile, side-by-side on sm+ -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.startTime") }}</Label>
        <Input v-model="startTimeModel" type="time" class="bg-muted/50" />
      </div>
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.endTime") }}</Label>
        <Input v-model="endTimeModel" type="time" class="bg-muted/50" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { DateTimeFormData } from "../types";

const props = defineProps<{
  modelValue: DateTimeFormData;
}>();

const emit = defineEmits<{
  "update:modelValue": [data: DateTimeFormData];
}>();

const { t } = useI18n();

const startDateModel = computed({
  get: () => props.modelValue.startDate,
  set: (value: string) => {
    // Auto-set end date to start date if end date is not set
    const endDate = value && !props.modelValue.endDate
      ? value
      : props.modelValue.endDate;
    emit("update:modelValue", {
      ...props.modelValue,
      startDate: value,
      endDate,
    });
  },
});

const endDateModel = computed({
  get: () => props.modelValue.endDate,
  set: (value: string) =>
    emit("update:modelValue", { ...props.modelValue, endDate: value }),
});

const startTimeModel = computed({
  get: () => props.modelValue.startTime,
  set: (value: string) =>
    emit("update:modelValue", { ...props.modelValue, startTime: value }),
});

const endTimeModel = computed({
  get: () => props.modelValue.endTime,
  set: (value: string) =>
    emit("update:modelValue", { ...props.modelValue, endTime: value }),
});
</script>
