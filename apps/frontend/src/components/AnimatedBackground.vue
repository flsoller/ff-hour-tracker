<template>
  <div
    class="absolute inset-0 overflow-hidden transition-opacity duration-300"
    :style="{ opacity: isMounted ? 1 : 0 }"
  >
    <div class="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30">
      <div class="absolute -top-32 -left-32 w-250 h-250 bg-linear-to-br from-blue-500/12 via-cyan-500/6 to-transparent rounded-full blur-3xl animate-pulse-slow dark:from-blue-500/8 dark:via-indigo-500/5" />
    </div>
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
