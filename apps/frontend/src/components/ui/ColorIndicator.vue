<template>
  <div
    class="inline-flex items-center justify-center rounded-full border-2 border-border p-0.5"
    :class="cn('transition-colors', sizeClasses, className)"
    role="img"
    :aria-label="`Color indicator: ${displayColor}`"
  >
    <div
      class="w-full h-full rounded-full"
      :style="{ backgroundColor: displayColor }"
    />
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed } from "vue";

interface Props {
  colorCode?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colorCode: null,
  size: "md",
  className: "",
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-5 w-5";
    case "lg":
      return "h-10 w-10";
    default:
      return "h-7 w-7";
  }
});

const displayColor = computed(() => {
  if (!props.colorCode) return "#6b7280";

  // If colorCode already has #, use as is
  if (props.colorCode.startsWith("#")) {
    return props.colorCode;
  }

  // If no #, add it for display
  return `#${props.colorCode}`;
});
</script>
