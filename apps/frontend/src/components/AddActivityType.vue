<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{
          isEditing
          ? t("configuration.addActivityTypeDialog.titleEdit")
          : t("configuration.addActivityTypeDialog.titleAdd")
        }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">{{
            t("configuration.addActivityTypeDialog.nameLabel")
          }}</Label>
          <Input
            id="name"
            data-testid="name"
            v-model="form.activityName"
            :placeholder="
              t(
                'configuration.addActivityTypeDialog.namePlaceholder',
              )
            "
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="description">{{
            t(
              "configuration.addActivityTypeDialog.descriptionLabel",
            )
          }}</Label>
          <Textarea
            id="description"
            data-testid="description"
            v-model="form.activityDescription"
            :placeholder="
              t(
                'configuration.addActivityTypeDialog.descriptionPlaceholder',
              )
            "
            rows="3"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="color">{{
            t("configuration.addActivityTypeDialog.colorLabel")
          }}</Label>
          <Select v-model="form.colorCode">
            <SelectTrigger>
              <SelectValue>
                <div v-if="form.colorCode" class="flex items-center gap-2">
                  <div
                    class="w-4 h-4 rounded-full border border-gray-300"
                    :style="{ backgroundColor: form.colorCode }"
                  >
                  </div>
                  <span>{{ getColorName(form.colorCode) }}</span>
                </div>
                <span v-else>{{
                  t(
                    "configuration.addActivityTypeDialog.colorPlaceholder",
                  )
                }}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="colorOption in colorOptions"
                :key="colorOption.value"
                :value="colorOption.value"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-4 h-4 rounded-full border border-gray-300"
                    :style="
                      {
                        backgroundColor: colorOption.value,
                      }
                    "
                  >
                  </div>
                  <span>{{ colorOption.name }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="onCancel">
            {{ t("common.actions.cancel") }}
          </Button>
          <Button type="submit" data-testid="submitActivityType">
            {{
              isEditing
              ? t(
                "configuration.addActivityTypeDialog.submitEdit",
              )
              : t(
                "configuration.addActivityTypeDialog.submitAdd",
              )
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  IActivityType,
  ICreateActivityReq,
} from "@hour-tracker/core-types/activities";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  open?: boolean;
  activityType?: IActivityType | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "submit": [activityType: ICreateActivityReq];
  "cancel": [];
}>();

const isOpen = ref(props.open ?? false);
const isEditing = computed(() => Boolean(props.activityType));

// Color options for activity types - using computed for reactive translations
const colorOptions = computed(() => [
  { name: t("configuration.colors.blue"), value: "#3B82F6" },
  { name: t("configuration.colors.red"), value: "#EF4444" },
  { name: t("configuration.colors.green"), value: "#10B981" },
  { name: t("configuration.colors.yellow"), value: "#F59E0B" },
  { name: t("configuration.colors.purple"), value: "#8B5CF6" },
  { name: t("configuration.colors.pink"), value: "#EC4899" },
  { name: t("configuration.colors.indigo"), value: "#6366F1" },
  { name: t("configuration.colors.teal"), value: "#14B8A6" },
  { name: t("configuration.colors.orange"), value: "#F97316" },
  { name: t("configuration.colors.slate"), value: "#64748B" },
]);

const form = reactive({
  activityName: "",
  activityDescription: "",
  colorCode: "",
});

function getColorName(colorValue: string): string {
  const colorOption = colorOptions.value.find(option =>
    option.value === colorValue
  );
  return colorOption?.name || t("configuration.colors.custom");
}

function populateForm(activityType: IActivityType) {
  form.activityName = activityType.activityName;
  form.activityDescription = activityType.activityDescription;
  form.colorCode = activityType.colorCode || "";
}

function resetForm() {
  form.activityName = "";
  form.activityDescription = "";
  form.colorCode = "";
}

function onSubmit() {
  const submitData: ICreateActivityReq = {
    activityName: form.activityName.trim(),
    activityDescription: form.activityDescription.trim(),
    colorCode: form.colorCode.split("#")[1]!,
  };

  emit("submit", submitData);
  resetForm();
}

function onCancel() {
  resetForm();
  isOpen.value = false;
  emit("cancel");
}

// Watch for activityType prop changes (for editing)
watch(() => props.activityType, (newActivityType) => {
  if (newActivityType) {
    populateForm(newActivityType);
  } else {
    resetForm();
  }
}, { immediate: true });

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue ?? false;

  // Set default color when opening for new activity type
  if (newValue && !props.activityType && !form.colorCode) {
    form.colorCode = colorOptions.value[0]!.value; // Default to blue
  }
}, { immediate: true });

// Emit open state changes
watch(isOpen, (newValue) => {
  emit("update:open", newValue);
});
</script>
