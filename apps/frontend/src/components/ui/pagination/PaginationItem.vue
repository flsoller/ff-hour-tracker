<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

interface PaginationItemProps {
  class?: HTMLAttributes["class"];
  isActive?: boolean;
  disabled?: boolean;
  page: number;
}

const props = withDefaults(defineProps<PaginationItemProps>(), {
  isActive: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [page: number];
}>();

function handleClick() {
  if (!props.disabled) {
    emit("click", props.page);
  }
}
</script>

<template>
  <li>
    <Button
      :variant="isActive ? 'default' : 'outline'"
      :disabled="disabled"
      size="sm"
      :class="
        cn(
          'h-9 w-9 p-0',
          isActive && 'pointer-events-none',
          props.class,
        )
      "
      @click="handleClick"
      :aria-label="`Go to page ${page}`"
      :aria-current="isActive ? 'page' : undefined"
    >
      <slot>{{ page }}</slot>
    </Button>
  </li>
</template>
