<template>
  <form class="container" @submit.prevent="onSubmit">
    <InputText
      placeholder="First Name"
      v-model="firstName"
      type="text"
      data-testid="firstName"
    />
    <InputText
      placeholder="Last Name"
      v-model="lastName"
      type="text"
      data-testid="lastName"
    />
    <InputText
      placeholder="Email Address"
      v-model="email"
      type="email"
      data-testid="email"
    />
    <Button
      data-testid="addMember"
      label="Add Member"
      type="submit"
      :disabled="!validForm"
      class="container__submit"
    />
  </form>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { inject, ref, watch } from "vue";
import { useMembersStore } from "../stores/members";
import { validateEmail, validateInputString } from "../utils/validate";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const validForm = ref(false);
const membersStore = useMembersStore();
const dialogRef = inject<{
  value: { close: Function };
}>("dialogRef");

watch(
  [() => firstName.value, () => lastName.value, () => email.value],
  ([newFirstName, newLastName, newEmail]) => {
    validForm.value = validateInputString(newFirstName).valid
      && validateInputString(newLastName).valid
      && validateEmail(newEmail).valid;
  },
);

async function onSubmit() {
  await membersStore.addNewMember({
    firstName: firstName.value,
    lastName: lastName.value,
    emailAddress: email.value,
  });
  closeDialog();
}

function closeDialog(): void {
  dialogRef?.value.close();
}
</script>

<style lang="scss" scoped>
// No @use needed as no shared variables or mixins are used here
.container {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  min-width: 20rem;

  &__submit {
    margin-top: 1.5rem;
  }
}
</style>
