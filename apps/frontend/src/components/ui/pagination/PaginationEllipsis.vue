<script setup lang="ts">
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";

interface PaginationEllipsisProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<PaginationEllipsisProps>();
</script>

<template>
  <li>
    <span
      :class="cn('flex h-9 w-9 items-center justify-center', props.class)"
      aria-hidden="true"
    >
      <MoreHorizontal class="h-4 w-4" />
      <span class="sr-only">More pages</span>
    </span>
  </li>
</template>
