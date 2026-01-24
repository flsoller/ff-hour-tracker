<template>
  <div class="space-y-4">
    <!-- Month and Year selection -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.month") }}</Label>
        <Select v-model="monthModel">
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="month in months"
              :key="month.value"
              :value="month.value.toString()"
            >
              {{ month.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.year") }}</Label>
        <Select v-model="yearModel">
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="year in years"
              :key="year"
              :value="year.toString()"
            >
              {{ year }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Duration: Hours + Minutes -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.hours") }}</Label>
        <Input
          v-model.number="model.hours"
          type="number"
          min="0"
          class="bg-muted/50"
        />
      </div>
      <div class="w-full space-y-2">
        <Label>{{ t("timeEntry.fields.minutes") }}</Label>
        <Input
          v-model.number="model.minutes"
          type="number"
          min="0"
          max="59"
          class="bg-muted/50"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { HoursMonthFormData } from "../types";

const model = defineModel<HoursMonthFormData>({ required: true });

const { t } = useI18n();

// Generate months array with localized labels
const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: t(`timeEntry.months.${i + 1}`),
  }))
);

// Generate years array: current year +/- 5 years
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
});

const monthModel = computed({
  get: () => model.value.month.toString(),
  set: (value: string) => {
    model.value = { ...model.value, month: parseInt(value, 10) };
  },
});

const yearModel = computed({
  get: () => model.value.year.toString(),
  set: (value: string) => {
    model.value = { ...model.value, year: parseInt(value, 10) };
  },
});
</script>
