<template>
  <ParticleBackground />
  <form class="container" @submit.prevent="onSubmit" id="loginForm">
    <div class="container__login">
      <InputGroup class="container__login__item">
        <InputGroupAddon>
          <i class="pi pi-user"></i>
        </InputGroupAddon>
        <InputText
          placeholder="Email"
          v-model="email"
          type="email"
          data-testid="email"
        />
      </InputGroup>
      <InputGroup class="container__login__item">
        <InputGroupAddon>
          <i class="pi pi-unlock"></i>
        </InputGroupAddon>
        <Password placeholder="Password" :feedback="false" v-model="password" />
      </InputGroup>
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
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import { ref, watch } from "vue";
import ParticleBackground from "../components/ParticleBackground.vue";
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
@use "@/styles/base/sizes" as *;
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;

  &__login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 20rem;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

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
