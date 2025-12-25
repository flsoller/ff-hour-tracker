<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t("members.addMemberDialog.title") }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName">{{ t("common.labels.firstName") }}</Label>
            <Input
              id="firstName"
              data-testid="firstName"
              v-model="form.firstName"
              :placeholder="t('common.placeholders.enterFirstName')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="lastName">{{ t("common.labels.lastName") }}</Label>
            <Input
              id="lastName"
              data-testid="lastName"
              v-model="form.lastName"
              :placeholder="t('common.placeholders.enterLastName')"
              required
            />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="emailAddress">{{ t("common.labels.email") }}</Label>
          <Input
            id="emailAddress"
            data-testid="email"
            v-model="form.emailAddress"
            type="email"
            :placeholder="t('common.placeholders.enterEmail')"
            required
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="onCancel">
            {{ t("common.actions.cancel") }}
          </Button>
          <Button type="submit" data-testid="addMember">
            {{ t("common.buttons.addMember") }}
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
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  open?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "submit": [
    member: { firstName: string; lastName: string; emailAddress: string },
  ];
}>();

const isOpen = ref(props.open ?? false);

const form = reactive({
  firstName: "",
  lastName: "",
  emailAddress: "",
});

function onSubmit() {
  emit("submit", { ...form });
  resetForm();
  emit("update:open", false);
}

function onCancel() {
  resetForm();
  emit("update:open", false);
}

function resetForm() {
  form.firstName = "";
  form.lastName = "";
  form.emailAddress = "";
}

watch(() => props.open, (newValue) => {
  isOpen.value = newValue ?? false;
}, { immediate: true });

watch(isOpen, (newValue) => {
  emit("update:open", newValue);
});
</script>
