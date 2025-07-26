<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

interface PaginationContentProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<PaginationContentProps>();
</script>

<template>
  <ul :class="cn('flex flex-row items-center gap-1', props.class)">
    <slot />
  </ul>
</template>
