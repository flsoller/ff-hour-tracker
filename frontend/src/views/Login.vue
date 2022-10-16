<template>
  <form class="container" @submit.prevent="onSubmit()">
    <div class="container__login">
      <div class="p-inputgroup container__login__item">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText placeholder="Email" v-model="email" />
      </div>
      <div class="p-inputgroup container__login__item">
        <span class="p-inputgroup-addon">
          <i class="pi pi-unlock"></i>
        </span>
        <Password placeholder="Password" :feedback="false" v-model="password" />
      </div>
      <Button label="Login" type="submit" :disabled="!validForm" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import { signIn } from '../services/auth';
import { validateEmail, validateInputString } from '../utils/validate';
import { ref, watch } from 'vue';

const email = ref('');
const password = ref('');
const validForm = ref(false);

async function onSubmit() {
  await signIn({
    emailAddress: email.value.toLowerCase(),
    password: password.value,
  });
}

watch([() => email.value, () => password.value], ([newEmail, newPassword]) => {
  validForm.value =
    validateEmail(newEmail).valid && validateInputString(newPassword).valid;
});
</script>

<style lang="scss" scoped>
.container {
  background-image: linear-gradient(
    to right top,
    #232e3c,
    #202c38,
    #1e2934,
    #1c2730,
    #1a242c,
    #1b242b,
    #1c242b,
    #1d242a,
    #21272c,
    #25292f,
    #282c31,
    #2c2f33
  );
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;

  &__login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 20rem;

    @media (min-width: $small) {
      min-width: 23rem;
    }

    @media (min-width: $medium) {
      min-width: 28rem;
    }

    &__item {
      padding-bottom: 0.2rem;
    }
  }
}
</style>
