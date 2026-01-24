<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@vueuse/core";
import { Info } from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useMediaQuery("(max-width: 768px)");
const isPopoverOpen = ref(false);
</script>

<template>
  <!-- Desktop: Tooltip -->
  <Tooltip v-if="!isMobile">
    <TooltipTrigger as-child>
      <button
        type="button"
        class="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Entry mode information"
      >
        <Info class="h-4 w-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" align="start" class="max-w-sm">
      <p class="text-xs">{{ t("timeEntry.modal.helpText") }}</p>
    </TooltipContent>
  </Tooltip>

  <!-- Mobile: Popover -->
  <Popover v-else v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Entry mode information"
      >
        <Info class="h-4 w-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="start" class="w-80">
      <p class="text-sm">{{ t("timeEntry.modal.helpText") }}</p>
    </PopoverContent>
  </Popover>
</template>
