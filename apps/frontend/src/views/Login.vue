<template>
  <div class="flex w-full h-screen items-center justify-center px-4">
    <div class="container">
      <form @submit.prevent="onSubmit" id="loginForm">
        <Card class="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle class="text-2xl">
              Login
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                v-model="email"
                data-testid="email"
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                v-model="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              class="w-full cursor-pointer"
              data-testid="login"
              label="Login"
              type="submit"
              :disabled="!validForm || userStore.loading"
              :loading="userStore.loading"
            >
              <div
                v-if="userStore.loading"
                class="flex justify-center items-center"
              >
                <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                Signing you in...
              </div>
              <div v-else class="">
                Sign In
              </div>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail, validateInputString } from "@/utils/validate";
import { Loader2 } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const email = ref("");
const password = ref("");
const validForm = ref(false);
const showInfo = ref(false);

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
