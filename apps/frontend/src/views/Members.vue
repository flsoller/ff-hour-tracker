<template>
  <div class="members-container flex flex-col h-full overflow-hidden p-6 gap-6">
    <!-- Fixed Header Section -->
    <div class="shrink-0 space-y-6">
      <!-- Title and Add Button -->
      <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">
            {{ t("members.title") }}
          </h1>
          <p class="text-muted-foreground">{{ t("members.subtitle") }}</p>
        </div>
        <Button @click="showAddMember = true" class="w-full sm:w-auto">
          <Plus class="mr-2 h-4 w-4" /> {{ t("common.buttons.addMember") }}
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
            :placeholder="t('common.placeholders.searchMembers')"
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
            {{ t("members.sortByLastName") }}
            <ArrowUpDown class="ml-2 h-3 w-3" />
            <ChevronUp
              v-if="membersStore.sortOrder === 'asc'"
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
      <MemberTableView
        :members="displayedMembers"
        :loading="membersStore.loading"
        :is-searching="!!searchQuery"
        @add-member="showAddMember = true"
        @copy-email="memberActions.copyEmail"
        @edit-member="memberActions.editMember"
        @view-member="memberActions.viewMemberDetails"
        @delete-member="memberActions.deleteMember"
      />

      <!-- Mobile Card View -->
      <MemberCardView
        :members="displayedMembers"
        :loading="membersStore.loading"
        :is-searching="!!searchQuery"
        @add-member="showAddMember = true"
        @copy-email="memberActions.copyEmail"
        @edit-member="memberActions.editMember"
        @view-member="memberActions.viewMemberDetails"
        @delete-member="memberActions.deleteMember"
      />
    </div>

    <!-- Fixed Pagination Controls -->
    <div class="shrink-0 mt-6">
      <PaginationControls
        v-if="!searchQuery"
        :current-page="currentPage"
        :page-size="pageSize"
        :total-items="membersStore.totalItems"
        :loading="membersStore.loading"
        :item-name="t('common.itemNames.members')"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @next-page="onNextPage"
        @previous-page="onPreviousPage"
      />
    </div>

    <AddMember
      v-model:open="showAddMember"
      @submit="onSubmitMember"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ICreateMemberReq } from "@hour-tracker/core-types/members";
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
import AddMember from "../components/AddMember.vue";
import MemberCardView from "../components/members/MemberCardView.vue";
import MemberTableView from "../components/members/MemberTableView.vue";
import PaginationControls from "../components/PaginationControls.vue";
import { useMemberActions } from "../composables/useMemberActions";
import { useMembersStore } from "../stores/members";

const { t } = useI18n();

const membersStore = useMembersStore();
const memberActions = useMemberActions();
const { members } = storeToRefs(membersStore);

const currentPage = ref<number>(1);
const pageSize = ref<number>(membersStore.defaultPageLimit);

const showAddMember = ref(false);
const searchQuery = ref("");

const totalPages = computed(() =>
  Math.ceil(membersStore.totalItems / pageSize.value)
);
const offset = computed(() => (currentPage.value - 1) * pageSize.value);

const currentPaginationParams = computed(() => ({
  limit: pageSize.value.toString(),
  offset: offset.value.toString(),
  order: membersStore.sortOrder,
}));

const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return members.value.data;
  }

  const query = searchQuery.value.toLowerCase();
  return members.value.data.filter(member =>
    member.firstName.toLowerCase().includes(query)
    || member.lastName.toLowerCase().includes(query)
    || member.emailAddress.toLowerCase().includes(query)
  );
});

const displayedMembers = computed(() => {
  if (searchQuery.value) {
    return filteredMembers.value;
  }

  return members.value.data;
});

watch(searchQuery, (newQuery, oldQuery) => {
  if (!newQuery && oldQuery) {
    loadMembers();
  }
});

onMounted(async () => {
  await loadMembers();
});

async function loadMembers() {
  await membersStore.getMembersPaginated(currentPaginationParams.value);
}

async function toggleSort() {
  const newOrder = membersStore.sortOrder === "asc" ? "desc" : "asc";
  await membersStore.changeSortOrder(newOrder, pageSize.value, offset.value);
}

async function onPageChange(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await loadMembers();
}

async function onPageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize;
  currentPage.value = 1; // Reset to first page when changing page size
  await loadMembers();
}

async function onNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadMembers();
  }
}

async function onPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    await loadMembers();
  }
}

async function onSubmitMember(memberData: ICreateMemberReq) {
  await membersStore.addNewMember(memberData, currentPaginationParams.value);
  showAddMember.value = false;
}
</script>
