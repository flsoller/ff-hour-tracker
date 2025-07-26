<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";
import { computed } from "vue";

interface PaginationProps {
  class?: HTMLAttributes["class"];
  total: number;
  itemsPerPage: number;
  currentPage?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  showFirstLast: true,
  showPrevNext: true,
});

const emit = defineEmits<{
  "page-change": [page: number];
}>();

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage));
const startIndex = computed(() =>
  (props.currentPage - 1) * props.itemsPerPage + 1
);
const endIndex = computed(() =>
  Math.min(props.currentPage * props.itemsPerPage, props.total)
);

// Generate page numbers to display
const pageNumbers = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(totalPages.value - 1, props.currentPage + 1);

    // Add ellipsis if needed
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add range around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages.value) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (end < totalPages.value - 1) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Always show last page
    if (totalPages.value > 1) {
      pages.push(totalPages.value);
    }
  }

  return pages;
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("page-change", page);
  }
}
</script>

<template>
  <nav
    :class="cn('mx-auto flex w-full justify-center', props.class)"
    role="navigation"
    aria-label="Pagination Navigation"
  >
    <slot
      :current-page="currentPage"
      :total-pages="totalPages"
      :start-index="startIndex"
      :end-index="endIndex"
      :page-numbers="pageNumbers"
      :go-to-page="goToPage"
    />
  </nav>
</template>
