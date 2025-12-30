<template>
  <SplashScreen ref="splashScreenRef" />

  <div
    v-if="isLoaded && !isSplashVisible"
    class="h-screen flex flex-col overflow-hidden"
  >
    <Toaster richColors />
    <SidebarProvider
      v-if="!$route.meta.hideSidebar"
      class="flex-1 flex overflow-hidden"
    >
      <AppSidebar />
      <SidebarInset class="flex-1 flex flex-col overflow-hidden">
        <header class="flex h-16 shrink-0 items-center gap-2 px-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <NavBar class="flex-1" />
        </header>
        <main class="flex-1 flex flex-col overflow-hidden p-4 pt-0">
          <RouterView class="flex-1 flex flex-col overflow-hidden" />
        </main>
      </SidebarInset>
    </SidebarProvider>
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 flex flex-col overflow-hidden">
        <RouterView class="flex-1 flex flex-col overflow-hidden" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import SplashScreen from "@/components/SplashScreen.vue";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@clerk/vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "vue-sonner/style.css";
import NavBar from "./components/NavBar.vue";

const { isLoaded, isSignedIn } = useAuth();
const router = useRouter();
const route = useRoute();

const splashScreenRef = ref<InstanceType<typeof SplashScreen> | null>(null);
const isSplashVisible = computed(() => {
  return splashScreenRef.value?.shouldShow ?? true;
});

watch(
  [isLoaded, isSignedIn, () => route.path],
  ([loaded, signedIn, _path]) => {
    if (!loaded) return;

    const isProtectedRoute = route.meta.protected;
    const isAuthRoute = route.name === "Login" || route.name === "SignUp";

    if (isProtectedRoute && !signedIn) {
      router.replace("/login");
    } else if (isAuthRoute && signedIn) {
      router.replace("/");
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;

  &__content {
    width: 100%;
  }
}
</style>
