<template>
  <div class="p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ t("nav.timesheet") }}
      </h1>
      <Button @click="showTimeEntryModal = true">
        <Plus class="h-4 w-4" /> {{ t("common.buttons.addTimeEntry") }}
      </Button>
    </div>

    <TimeEntryModal
      v-model:open="showTimeEntryModal"
      :activities-loading="activitiesStore.loading"
      :members-loading="membersStore.loading"
      :activities="selectableActivities"
      :members="selectableMembers"
      @submit="handleTimeEntrySubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import TimeEntryModal from "@/features/time-entry/components/TimeEntryModal.vue";
import type {
  SelectableActivity,
  SelectableMember,
} from "@/features/time-entry/types";
import { useActivityTypesStore } from "@/stores/activities";
import { useMembersStore } from "@/stores/members";
import type { ICreateTimelogReq } from "@hour-tracker/core-types/timelogs";
import { Plus } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const membersStore = useMembersStore();
const activitiesStore = useActivityTypesStore();
const showTimeEntryModal = ref(false);

/**
 * Prepare members for dop down select
 */
const selectableMembers = computed<SelectableMember[]>(() => {
  const members = membersStore.members?.data ?? [];
  return members.map((m) => ({
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    fullName: `${m.firstName} ${m.lastName}`,
  }));
});

/**
 * Sets active activity types as available options until API supports query params
 * for paginated endpoints
 */
const selectableActivities = computed<SelectableActivity[]>(() => {
  const activities = activitiesStore.activities?.data ?? [];
  return activities
    .filter((a) => a.active)
    .map((a) => ({
      id: a.id,
      activityName: a.activityName,
      colorCode: a.colorCode,
    }));
});

/**
 * Fetches members & activities for the user to select in the form
 */
onMounted(async () => {
  await Promise.all([
    membersStore.getMembersPaginated({ limit: "1000", offset: "0" }),
    activitiesStore.getActivitiesPaginated({ limit: 1000, offset: 0 }),
  ]);
});

/**
 * Handle submit
 * @param entries
 */
function handleTimeEntrySubmit(entries: ICreateTimelogReq[]): void {
  console.log("Time entries submitted:", entries);
}
</script>
