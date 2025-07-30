<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Member</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName">First Name</Label>
            <Input
              id="firstName"
              data-testid="firstName"
              v-model="form.firstName"
              placeholder="Enter first name"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="lastName">Last Name</Label>
            <Input
              id="lastName"
              data-testid="lastName"
              v-model="form.lastName"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="emailAddress">Email Address</Label>
          <Input
            id="emailAddress"
            data-testid="email"
            v-model="form.emailAddress"
            type="email"
            placeholder="Enter email address"
            required
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="onCancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="addMember">
            Add Member
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
