<template>
  <Transition name="splash-fade">
    <div
      v-if="shouldShow"
      class="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
    >
      <AnimatedBackground />
      <div class="relative z-10 flex flex-col items-center justify-center space-y-8">
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
          <div class="relative bg-linear-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl animate-float">
            <Clock class="h-16 w-16 text-white" />
          </div>
        </div>

        <div class="text-center space-y-2">
          <h1 class="text-5xl font-semibold bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {{ t("common.splash.appName") }}
          </h1>
          <p class="text-lg text-muted-foreground">
            {{ t("common.splash.tagline") }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <div
            class="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          />
          <div
            class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          />
          <div
            class="h-2 w-2 bg-cyan-500 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          />
        </div>
        <p class="text-sm text-muted-foreground animate-pulse">
          {{ t("common.splash.loading") }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSplashTiming } from "@/composables/useSplashTiming";
import { useAuth } from "@clerk/vue";
import { Clock } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import AnimatedBackground from "./AnimatedBackground.vue";

const { isLoaded } = useAuth();
const { shouldShow } = useSplashTiming(isLoaded);
const { t } = useI18n();

defineExpose({
  shouldShow,
});
</script>

<style scoped>
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.3s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}
</style>
