<template>
  <div class="space-y-4">
    <!-- Date input -->
    <div class="space-y-2">
      <Label>{{ t("timeEntry.fields.date") }}</Label>
      <Input v-model="model.date" type="date" class="bg-muted/50" />
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
import { useI18n } from "vue-i18n";
import type { HoursDayFormData } from "../types";

const model = defineModel<HoursDayFormData>({ required: true });

const { t } = useI18n();
</script>
