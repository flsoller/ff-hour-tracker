import { computed, onMounted, type Ref, ref } from "vue";

export function useSplashTiming(isLoaded: Ref<boolean>) {
  const minimumDisplayTime = 1500;
  const startTime = ref<number>(0);
  const canHide = ref(false);

  onMounted(() => {
    startTime.value = Date.now();

    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.value;

      if (elapsed >= minimumDisplayTime && isLoaded.value) {
        canHide.value = true;
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      canHide.value = true;
    }, 10000);
  });

  const shouldShow = computed(() => !canHide.value);
  return {
    shouldShow,
  };
}
