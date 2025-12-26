<template>
  <div class="configuration-container flex flex-col h-full overflow-hidden p-6 gap-6">
    <!-- Fixed Header Section -->
    <div class="shrink-0 space-y-6">
      <!-- Title and Add Button -->
      <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">
            {{ t("configuration.title") }}
          </h1>
          <p class="text-muted-foreground">
            {{ t("configuration.subtitle") }}
          </p>
        </div>
        <Button @click="showAddActivityType = true" class="w-full sm:w-auto">
          <Plus class="mr-2 h-4 w-4" />
          {{ t("common.buttons.addActivityType") }}
        </Button>
      </div>

      <!-- Search and Filter Section -->
      <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div class="relative flex-1 max-w-sm">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="searchQuery"
            :placeholder="t('common.placeholders.searchActivityTypes')"
            class="pl-9"
          />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-muted-foreground">{{
              t("common.actions.sortBy")
            }}:</span>
          <Button
            variant="outline"
            size="sm"
            @click="toggleSort"
            class="h-8"
          >
            {{ t("configuration.sortByActivityName") }}
            <ArrowUpDown class="ml-2 h-3 w-3" />
            <ChevronUp
              v-if="activityTypesStore.sortOrder === 'asc'"
              class="ml-1 h-3 w-3"
            />
            <ChevronDown v-else class="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Flexible Content Area -->
    <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
      <!-- Desktop Table View -->
      <ActivityTypeTableView
        :activity-types="displayedActivityTypes"
        :loading="activityTypesStore.loading"
        :is-searching="!!searchQuery"
        @add-activity-type="showAddActivityType = true"
        @edit-activity-type="activityTypeActions.editActivityType"
        @toggle-status="activityTypeActions.toggleActivityTypeStatus"
      />

      <!-- Mobile Card View -->
      <ActivityTypeCardView
        :activity-types="displayedActivityTypes"
        :loading="activityTypesStore.loading"
        :is-searching="!!searchQuery"
        @add-activity-type="showAddActivityType = true"
        @edit-activity-type="activityTypeActions.editActivityType"
        @toggle-status="activityTypeActions.toggleActivityTypeStatus"
      />
    </div>

    <!-- Fixed Pagination Controls -->
    <div class="shrink-0 mt-6">
      <PaginationControls
        v-if="!searchQuery"
        :current-page="currentPage"
        :page-size="pageSize"
        :total-items="activityTypesStore.totalItems"
        :loading="activityTypesStore.loading"
        :item-name="t('common.itemNames.activityTypes')"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @next-page="onNextPage"
        @previous-page="onPreviousPage"
      />
    </div>

    <!-- Add Activity Type Modal -->
    <AddActivityType
      v-model:open="showAddActivityType"
      :loading="isSubmitting"
      @submit="onSubmitNewActivityType"
    />

    <!-- Edit Activity Type Modal -->
    <AddActivityType
      v-model:open="activityTypeActions.isEditModalOpen.value"
      :activity-type="activityTypeActions.editingActivityType.value"
      :loading="isSubmitting"
      @submit="onSubmitEditActivityType"
      @cancel="activityTypeActions.closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ICreateActivityReq } from "@hour-tracker/core-types/activities";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
import ActivityTypeCardView from "../components/activities/ActivityTypeCardView.vue";
import ActivityTypeTableView from "../components/activities/ActivityTypeTableView.vue";
import AddActivityType from "../components/AddActivityType.vue";
import PaginationControls from "../components/PaginationControls.vue";
import { useActivityTypeActions } from "../composables/useActivityTypeActions";
import { useActivityTypesStore } from "../stores/activities";

const activityTypesStore = useActivityTypesStore();
const activityTypeActions = useActivityTypeActions();
const { activities } = storeToRefs(activityTypesStore);

const currentPage = ref<number>(1);
const pageSize = ref<number>(activityTypesStore.defaultPageLimit);

const showAddActivityType = ref(false);
const searchQuery = ref("");
const isSubmitting = ref(false);

const totalPages = computed(() =>
  Math.ceil(activityTypesStore.totalItems / pageSize.value)
);
const offset = computed(() => (currentPage.value - 1) * pageSize.value);

const currentPaginationParams = computed(() => ({
  limit: pageSize.value,
  offset: offset.value,
  order: activityTypesStore.sortOrder,
}));

const filteredActivityTypes = computed(() => {
  if (!searchQuery.value) {
    return activities.value.data;
  }

  const query = searchQuery.value.toLowerCase();
  return activities.value.data.filter(activityType =>
    activityType.activityName.toLowerCase().includes(query)
    || activityType.activityDescription.toLowerCase().includes(query)
  );
});

const displayedActivityTypes = computed(() => {
  if (searchQuery.value) {
    return filteredActivityTypes.value;
  }

  return activities.value.data;
});

watch(searchQuery, (newQuery, oldQuery) => {
  if (!newQuery && oldQuery) {
    loadActivityTypes();
  }
});

onMounted(async () => {
  await loadActivityTypes();
});

async function loadActivityTypes() {
  await activityTypesStore.getActivitiesPaginated(
    currentPaginationParams.value,
  );
}

async function toggleSort() {
  const newOrder = activityTypesStore.sortOrder === "asc" ? "desc" : "asc";
  await activityTypesStore.changeSortOrder(
    newOrder,
    pageSize.value,
    offset.value,
  );
}

async function onPageChange(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await loadActivityTypes();
}

async function onPageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize;
  currentPage.value = 1; // Reset to first page when changing page size
  await loadActivityTypes();
}

async function onNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadActivityTypes();
  }
}

async function onPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    await loadActivityTypes();
  }
}

async function onSubmitNewActivityType(activityTypeData: ICreateActivityReq) {
  isSubmitting.value = true;
  await activityTypesStore.addNewActivity(
    activityTypeData,
    currentPaginationParams.value,
  );
  isSubmitting.value = false;
  showAddActivityType.value = false;
}

async function onSubmitEditActivityType(activityTypeData: ICreateActivityReq) {
  const activityType = activityTypeActions.editingActivityType.value;
  if (!activityType) return;

  isSubmitting.value = true;
  const success = await activityTypesStore.updateExistingActivity(
    activityType.id,
    activityTypeData,
    currentPaginationParams.value,
  );
  isSubmitting.value = false;

  if (success) {
    activityTypeActions.closeEditModal();
  }
}
</script>
