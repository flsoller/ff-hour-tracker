<template>
  <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-t pt-4">
    <!-- Pagination Info -->
    <div class="text-sm text-muted-foreground">
      <span v-if="totalItems > 0">
        Showing {{ startIndex }}-{{ endIndex }} of {{ totalItems }}
        {{ itemName }}
      </span>
      <span v-else>
        No {{ itemName }} found
      </span>
    </div>

    <!-- Desktop: Pagination Settings and Navigation -->
    <div class="hidden sm:flex sm:items-center sm:space-x-6">
      <!-- Page Size Selector -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-muted-foreground">Rows per page:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" class="h-8 w-16 gap-1">
              {{ pageSize }} <ChevronDown class="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              v-for="size in pageSizeOptions"
              :key="size"
              @click="handlePageSizeChange(String(size))"
              :class="size === pageSize ? 'bg-accent' : ''"
            >
              {{ size }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Page Navigation -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-muted-foreground">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <div class="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1 || loading"
            @click="goToPreviousPage"
            class="h-8 w-8 p-0"
            aria-label="Go to previous page"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages || loading"
            @click="goToNextPage"
            class="h-8 w-8 p-0"
            aria-label="Go to next page"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile: Vertical Stack -->
    <div class="flex flex-col space-y-3 sm:hidden">
      <!-- Page Size Selector -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Rows per page:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" class="h-9 w-20 gap-1">
              {{ pageSize }} <ChevronDown class="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              v-for="size in pageSizeOptions"
              :key="size"
              @click="handlePageSizeChange(String(size))"
              :class="size === pageSize ? 'bg-accent' : ''"
            >
              {{ size }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Full Pagination Navigation for Mobile -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <Pagination
          :total="totalItems"
          :items-per-page="pageSize"
          :current-page="currentPage"
          @page-change="goToPage"
          class="w-full max-w-md"
        >
          <template #default="{ pageNumbers, goToPage: paginationGoToPage }">
            <PaginationContent>
              <PaginationPrevious
                :disabled="currentPage <= 1 || loading"
                @click="goToPreviousPage"
              />

              <template v-for="(page, index) in pageNumbers" :key="index">
                <PaginationEllipsis v-if="page === -1" />
                <PaginationItem
                  v-else
                  :page="page"
                  :is-active="page === currentPage"
                  :disabled="loading"
                  @click="paginationGoToPage"
                />
              </template>

              <PaginationNext
                :disabled="currentPage >= totalPages || loading"
                @click="goToNextPage"
              />
            </PaginationContent>
          </template>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";

interface PaginationControlsProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  loading?: boolean;
  itemName?: string;
  pageSizeOptions?: number[];
}

const props = withDefaults(defineProps<PaginationControlsProps>(), {
  loading: false,
  itemName: "items",
  pageSizeOptions: () => [5, 10, 25, 50],
});

const emit = defineEmits<{
  "page-change": [page: number];
  "page-size-change": [pageSize: number];
  "next-page": [];
  "previous-page": [];
}>();

// Computed values
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));
const startIndex = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});
const endIndex = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems);
});

// Event handlers
function goToPage(page: number) {
  if (
    page >= 1 && page <= totalPages.value && page !== props.currentPage
    && !props.loading
  ) {
    emit("page-change", page);
  }
}

function goToNextPage() {
  if (props.currentPage < totalPages.value && !props.loading) {
    emit("next-page");
  }
}

function goToPreviousPage() {
  if (props.currentPage > 1 && !props.loading) {
    emit("previous-page");
  }
}

function handlePageSizeChange(value: string) {
  const newPageSize = parseInt(value, 10);
  if (newPageSize !== props.pageSize) {
    emit("page-size-change", newPageSize);
  }
}
</script>
