<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="flex max-h-[90vh] flex-row overflow-hidden p-0 md:h-[80vh] md:max-w-4xl"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DialogHeader class="shrink-0 p-6 pb-0">
          <DialogTitle>{{ t("timeEntry.modal.title") }}</DialogTitle>
          <div class="flex items-center gap-2">
            <DialogDescription>{{
              t("timeEntry.modal.description")
            }}</DialogDescription>
            <EntryModeTooltip />
          </div>
        </DialogHeader>

        <form
          @submit.prevent="onSubmit"
          class="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div class="min-h-0 flex-1 space-y-6 overflow-y-auto p-6 pt-4">
            <EntryModeSelector
              :model-value="form.formState.mode"
              @update:model-value="form.setMode"
            />

            <template v-if="activitiesLoading">
              <div class="space-y-4">
                <Skeleton class="h-16 w-full" />
                <Skeleton class="h-10 w-full" />
                <Skeleton class="h-24 w-full" />
              </div>
            </template>

            <template v-else>
              <DateTimeFields
                v-if="
                  form.currentMode.value
                  === TimeEntryMode.DATE_TIME
                "
                :model-value="form.formState.dateTime"
                @update:model-value="updateDateTime"
              />

              <DateHoursFields
                v-else-if="
                  form.currentMode.value
                  === TimeEntryMode.HOURS_DAY
                "
                :model-value="form.formState.hoursDay"
                @update:model-value="updateHoursDay"
              />

              <MonthHoursFields
                v-else-if="
                  form.currentMode.value
                  === TimeEntryMode.HOURS_MONTH
                "
                :model-value="form.formState.hoursMonth"
                @update:model-value="updateHoursMonth"
              />

              <ActivityTypeSelect
                :model-value="form.formState.activityTypeId"
                :activities="activities"
                @update:model-value="form.formState.activityTypeId = $event"
              />

              <div class="space-y-2 md:hidden">
                <Label>{{ t("timeEntry.fields.teamMembers") }}</Label>
                <button
                  type="button"
                  class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  @click="isMemberSheetOpen = true"
                >
                  <div class="flex items-center gap-2">
                    <Users class="h-4 w-4 text-muted-foreground" />
                    <span
                      :class="
                        form.formState.memberIds.length > 0
                        ? ''
                        : 'text-muted-foreground'
                      "
                    >
                      {{
                        form.formState.memberIds.length
                          > 0
                        ? t(
                          "timeEntry.fields.teamMembersSelected",
                          {
                            count:
                              form.formState.memberIds
                                .length,
                          },
                        )
                        : t(
                          "timeEntry.fields.teamMembersPlaceholder",
                        )
                      }}
                    </span>
                  </div>
                  <ChevronRight class="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div class="space-y-2">
                <Label for="notes">{{ t("timeEntry.fields.notes") }}</Label>
                <Textarea
                  id="notes"
                  v-model="form.formState.notes"
                  :placeholder="t('timeEntry.fields.notesPlaceholder')"
                  rows="3"
                  class="resize-y"
                />
              </div>

              <div class="flex items-center gap-2">
                <Checkbox
                  id="createMore"
                  :checked="form.formState.createMore"
                  @update:checked="
                    form.formState.createMore =
                    $event as boolean
                  "
                />
                <label
                  for="createMore"
                  class="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ t("timeEntry.fields.createMore") }}
                </label>
              </div>

              <div
                v-if="form.errors.value.length > 0"
                class="rounded-md bg-destructive/10 p-3"
              >
                <ul class="list-inside list-disc space-y-1 text-sm text-destructive">
                  <li v-for="error in form.errors.value" :key="error.field">
                    {{ error.message }}
                  </li>
                </ul>
              </div>
            </template>
          </div>

          <div class="shrink-0 border-t p-6 pt-4">
            <Button
              type="submit"
              class="w-full"
              :disabled="
                isSubmitting || activitiesLoading
                || membersLoading
              "
            >
              <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              <Plus v-else class="mr-2 h-4 w-4" />
              {{
                isSubmitting
                ? t("timeEntry.buttons.adding")
                : t("timeEntry.buttons.addEntry")
              }}
            </Button>
          </div>
        </form>
      </div>

      <MemberSelectionPanel
        :model-value="form.formState.memberIds"
        :members="members"
        :loading="membersLoading"
        class="hidden w-70 shrink-0 md:flex"
        @update:model-value="form.formState.memberIds = $event"
      />
    </DialogContent>
  </Dialog>

  <Sheet v-model:open="isMemberSheetOpen">
    <SheetContent side="bottom" class="h-[70vh] p-0">
      <MemberSelectionPanel
        :model-value="form.formState.memberIds"
        :members="members"
        :loading="membersLoading"
        class="h-full border-l-0"
        @update:model-value="form.formState.memberIds = $event"
      />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  type ICreateTimelogReq,
  TimeEntryMode,
} from "@hour-tracker/core-types/timelogs";
import { ChevronRight, Loader2, Plus, Users } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { useTimeEntryForm } from "../composables/useTimeEntryForm";
import { createTimeEntries } from "../services/timeEntry";
import {
  type DateTimeFormData,
  type HoursDayFormData,
  type HoursMonthFormData,
  type SelectableActivity,
  type SelectableMember,
} from "../types";
import ActivityTypeSelect from "./ActivityTypeSelect.vue";
import DateHoursFields from "./DateHoursFields.vue";
import DateTimeFields from "./DateTimeFields.vue";
import EntryModeSelector from "./EntryModeSelector.vue";
import EntryModeTooltip from "./EntryModeTooltip.vue";
import MemberSelectionPanel from "./MemberSelectionPanel.vue";
import MonthHoursFields from "./MonthHoursFields.vue";

const props = defineProps<{
  open?: boolean;
  activitiesLoading?: boolean;
  membersLoading?: boolean;
  activities: SelectableActivity[];
  members: SelectableMember[];
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [entries: ICreateTimelogReq[]];
}>();

const { t } = useI18n();

const isOpen = ref(props.open ?? false);
const isSubmitting = ref(false);
const isMemberSheetOpen = ref(false);

const form = useTimeEntryForm();

watch(
  () => props.open,
  (newValue) => {
    isOpen.value = newValue ?? false;
  },
  { immediate: true },
);

watch(isOpen, (newValue) => {
  emit("update:open", newValue);
  if (!newValue) {
    form.resetForm();
  }
});

function updateDateTime(data: DateTimeFormData): void {
  form.formState.dateTime = data;
}

function updateHoursDay(data: HoursDayFormData): void {
  form.formState.hoursDay = data;
}

function updateHoursMonth(data: HoursMonthFormData): void {
  form.formState.hoursMonth = data;
}

async function onSubmit(): Promise<void> {
  const validation = form.validate();
  if (!validation.isValid) {
    return;
  }

  isSubmitting.value = true;

  try {
    const requests = form.buildRequests();
    const [response, error] = await createTimeEntries(requests);
    if (error) {
      toast.error(t("timeEntry.toasts.createError"));
      return;
    }
    emit("submit", requests);

    const count = response?.created.length ?? 0;
    toast.success(t("timeEntry.toasts.createSuccess", { count }));

    if (form.formState.createMore) {
      form.resetForCreateMore();
    } else {
      isOpen.value = false;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
