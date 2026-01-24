<template>
  <div class="flex h-full flex-col border-l bg-muted/30">
    <!-- Panel Header -->
    <div class="border-b p-4">
      <h3 class="text-sm font-medium">
        {{ t("timeEntry.fields.teamMembers") }}
      </h3>
      <p class="mt-1 text-xs text-muted-foreground">
        {{
          t("timeEntry.fields.teamMembersSelected", {
            count: selectedCount,
          })
        }}
      </p>
    </div>

    <!-- Search Input -->
    <div class="border-b p-3">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          type="text"
          :placeholder="t('timeEntry.fields.searchMembers')"
          class="pl-9"
        />
      </div>
    </div>

    <!-- Member List (scrollable) -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading skeleton -->
      <template v-if="loading">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-3 px-4 py-3"
        >
          <Skeleton class="h-4 w-4 rounded" />
          <Skeleton class="h-4 flex-1" />
        </div>
      </template>

      <!-- Member rows -->
      <template v-else>
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          role="button"
          tabindex="0"
          class="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
          @click="toggleMember(member.id)"
          @keydown.enter.space.prevent="toggleMember(member.id)"
        >
          <Checkbox
            :model-value="isSelected(member.id)"
            class="pointer-events-none"
          />
          <span class="flex-1 text-sm">{{ member.fullName }}</span>
        </div>

        <!-- Empty state: no members available -->
        <div
          v-if="members.length === 0"
          class="px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {{ t("timeEntry.fields.noMembers") }}
        </div>

        <!-- Empty state: no search results -->
        <div
          v-else-if="filteredMembers.length === 0"
          class="px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {{ t("timeEntry.fields.noMembersFound") }}
        </div>
      </template>
    </div>

    <!-- Selected summary footer -->
    <div v-if="selectedCount > 0" class="border-t p-3">
      <p class="text-xs text-muted-foreground">
        <span class="font-medium">{{
          t("timeEntry.fields.selectedMembers")
        }}</span>
        {{ selectedNames }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { SelectableMember } from "../types";

const props = defineProps<{
  modelValue: string[];
  members: SelectableMember[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [ids: string[]];
}>();

const { t } = useI18n();

// Search state
const searchQuery = ref("");

// Computed: filtered members based on search
const filteredMembers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return props.members;

  return props.members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(query)
      || member.firstName.toLowerCase().includes(query)
      || member.lastName.toLowerCase().includes(query),
  );
});

// Computed: selection count
const selectedCount = computed(() => props.modelValue.length);

// Computed: selected names for footer
const selectedNames = computed(() => {
  const selected = props.members.filter((m) => props.modelValue.includes(m.id));
  return selected.map((m) => m.fullName).join(", ");
});

// Computed: set of selected IDs for efficient lookup
const selectedIds = computed(() => new Set(props.modelValue ?? []));

// Methods
function isSelected(memberId: string): boolean {
  return selectedIds.value.has(memberId);
}

function toggleMember(memberId: string): void {
  const newValue = isSelected(memberId)
    ? props.modelValue.filter((id) => id !== memberId)
    : [...props.modelValue, memberId];
  emit("update:modelValue", newValue);
}
</script>
