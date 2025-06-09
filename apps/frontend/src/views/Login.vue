<template>
  <form class="container" @submit.prevent="onSubmit" id="loginForm">
    <div class="container__login">
      <div class="p-inputgroup container__login__item">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText
          placeholder="Email"
          v-model="email"
          type="email"
          data-testid="email"
        />
      </div>
      <div class="p-inputgroup container__login__item">
        <span class="p-inputgroup-addon">
          <i class="pi pi-unlock"></i>
        </span>
        <Password placeholder="Password" :feedback="false" v-model="password" />
      </div>
      <Button
        data-testid="login"
        label="Login"
        type="submit"
        :disabled="!validForm || userStore.loading"
        :loading="userStore.loading"
      />
    </div>
    <div
      class="container__login__info"
      v-if="showInfo"
      data-testid="infoContainer"
    >
      <Message severity="info" sticky>{{ infoContent }}</Message>
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import { ref, watch } from "vue";
import { useUserStore } from "../stores/user";
import { validateEmail, validateInputString } from "../utils/validate";

const userStore = useUserStore();
const email = ref("");
const password = ref("");
const validForm = ref(false);
const showInfo = ref(false);
const infoContent =
  "The free resources enabling this project can take up to 30 seconds to initialize. Please wait...";

async function onSubmit() {
  const infoTimer = setTimeout(() => {
    showInfo.value = true;
  }, 2000);
  await userStore.login(email.value, password.value);
  clearTimeout(infoTimer);
}

watch([() => email.value, () => password.value], ([newEmail, newPassword]) => {
  validForm.value = validateEmail(newEmail).valid
    && validateInputString(newPassword).valid;
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

    &__info {
      position: absolute;
      bottom: 0;
      max-width: 90%;

      @media (min-width: $medium) {
        bottom: 1rem;
      }
    }
  }
}
</style>
