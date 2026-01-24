<template>
  <div class="space-y-2">
    <Label for="activity-type">{{ t("timeEntry.fields.activityType") }}</Label>
    <Select
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event as string)"
    >
      <SelectTrigger :disabled="disabled">
        <SelectValue>
          <div v-if="selectedActivity" class="flex items-center gap-2">
            <div
              v-if="selectedActivity.colorCode"
              class="h-3 w-3 rounded-full border border-gray-300"
              :style="
                {
                  backgroundColor: `#${selectedActivity.colorCode}`,
                }
              "
            />
            <span>{{ selectedActivity.activityName }}</span>
          </div>
          <span v-else class="text-muted-foreground">
            {{ t("timeEntry.fields.activityTypePlaceholder") }}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div
          v-if="activities.length === 0"
          class="px-2 py-4 text-center text-sm text-muted-foreground"
        >
          {{ t("timeEntry.fields.noActivities") }}
        </div>
        <SelectItem
          v-for="activity in activities"
          :key="activity.id"
          :value="activity.id"
        >
          <div class="flex items-center gap-2">
            <div
              v-if="activity.colorCode"
              class="h-3 w-3 rounded-full border border-gray-300"
              :style="{ backgroundColor: `#${activity.colorCode}` }"
            />
            <span>{{ activity.activityName }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
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
import type { SelectableActivity } from "../types";

const props = defineProps<{
  modelValue: string;
  activities: SelectableActivity[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [id: string];
}>();

const { t } = useI18n();

const selectedActivity = computed(() =>
  props.activities.find((a) => a.id === props.modelValue)
);
</script>
