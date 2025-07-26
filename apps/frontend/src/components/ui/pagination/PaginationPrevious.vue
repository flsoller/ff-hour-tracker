<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";

interface PaginationPreviousProps {
  class?: HTMLAttributes["class"];
  disabled?: boolean;
}

const props = withDefaults(defineProps<PaginationPreviousProps>(), {
  disabled: false,
});

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  if (!props.disabled) {
    emit("click");
  }
}
</script>

<template>
  <li>
    <Button
      variant="outline"
      size="sm"
      :disabled="disabled"
      :class="cn('h-9 px-3 gap-1', props.class)"
      @click="handleClick"
      aria-label="Go to previous page"
    >
      <ChevronLeft class="h-4 w-4" />
      <span class="hidden sm:inline">Previous</span>
    </Button>
  </li>
</template>
