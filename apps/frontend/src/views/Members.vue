<template>
  <div class="members-container flex flex-col h-full overflow-hidden p-6 gap-6">
    <!-- Fixed Header Section -->
    <div class="shrink-0 space-y-6">
      <!-- Title and Add Button -->
      <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Members</h1>
          <p class="text-muted-foreground">Manage your organization members</p>
        </div>
        <Button @click="showAddMember = true" class="w-full sm:w-auto">
          <Plus class="mr-2 h-4 w-4" />
          Add Member
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
            placeholder="Search members..."
            class="pl-9"
          />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant="outline"
            size="sm"
            @click="toggleSort"
            class="h-8"
          >
            Last Name
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
      <div class="hidden lg:block flex-1 min-h-0">
        <div class="rounded-lg border bg-card overflow-hidden h-full">
          <div class="h-full overflow-auto">
            <Table>
              <TableHeader class="sticky top-0 z-10 bg-card border-b">
                <TableRow class="hover:bg-transparent">
                  <TableHead class="w-12 bg-card"></TableHead>
                  <TableHead class="font-semibold bg-card">Member</TableHead>
                  <TableHead class="font-semibold bg-card"
                  >Email Address</TableHead>
                  <TableHead class="font-semibold bg-card">Status</TableHead>
                  <TableHead class="w-10 bg-card"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <!-- Loading State -->
                <TableRow v-if="membersStore.loading">
                  <TableCell :colspan="5" class="text-center py-12">
                    <div class="flex flex-col items-center space-y-3">
                      <div class="flex space-x-1">
                        <div class="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]">
                        </div>
                        <div class="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]">
                        </div>
                        <div class="h-2 w-2 bg-primary rounded-full animate-bounce">
                        </div>
                      </div>
                      <p class="text-sm text-muted-foreground">
                        Loading members...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>

                <!-- Empty State -->
                <TableRow
                  v-else-if="
                    displayedMembers.length === 0
                    && !searchQuery
                  "
                >
                  <TableCell :colspan="5" class="text-center py-12">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Users class="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div class="text-center">
                        <h3 class="text-lg font-semibold">No members yet</h3>
                        <p class="text-sm text-muted-foreground mb-4">
                          Get started by adding your first team member
                        </p>
                        <Button @click="showAddMember = true" size="sm">
                          <Plus class="mr-2 h-4 w-4" />
                          Add First Member
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                <!-- No Search Results -->
                <TableRow
                  v-else-if="
                    displayedMembers.length === 0
                    && searchQuery
                  "
                >
                  <TableCell :colspan="5" class="text-center py-12">
                    <div class="flex flex-col items-center space-y-4">
                      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Search class="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div class="text-center">
                        <h3 class="text-lg font-semibold">
                          No results found
                        </h3>
                        <p class="text-sm text-muted-foreground">
                          Try adjusting your search to find what you're looking
                          for
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                <!-- Member Rows -->
                <TableRow
                  v-else
                  v-for="member in displayedMembers"
                  :key="member.id"
                  class="hover:bg-muted/50 transition-colors"
                >
                  <TableCell class="w-12">
                    <Avatar class="h-9 w-9">
                      <AvatarFallback class="text-sm font-medium">
                        {{
                          getInitials(
                            member.firstName,
                            member.lastName,
                          )
                        }}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div class="flex flex-col">
                      <span class="font-medium">{{ member.firstName }}
                        {{ member.lastName }}</span>
                      <span class="text-sm text-muted-foreground">Member since
                        {{ formatJoinDate() }}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="flex items-center space-x-2">
                      <span>{{ member.emailAddress }}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="
                          copyEmail(
                            member.emailAddress,
                          )
                        "
                        class="h-6 w-6 p-0 hover:bg-muted"
                      >
                        <Copy class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" class="text-xs">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell class="w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                          <MoreHorizontal class="h-4 w-4" />
                          <span class="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuItem @click="editMember()">
                          <Edit class="mr-2 h-4 w-4" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="viewMemberDetails()">
                          <Eye class="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          @click="deleteMember()"
                          class="text-destructive focus:text-destructive"
                        >
                          <Trash2 class="mr-2 h-4 w-4" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="lg:hidden flex-1 min-h-0 overflow-y-auto">
        <div class="space-y-4">
          <!-- Loading State -->
          <div v-if="membersStore.loading" class="space-y-4">
            <Card v-for="i in 3" :key="i" class="p-4">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-muted rounded-full animate-pulse">
                </div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-muted rounded animate-pulse"></div>
                  <div class="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Empty State -->
          <Card
            v-else-if="displayedMembers.length === 0 && !searchQuery"
            class="p-8"
          >
            <div class="text-center space-y-4">
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users class="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">No members yet</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Get started by adding your first team member
                </p>
                <Button @click="showAddMember = true" size="sm">
                  <Plus class="mr-2 h-4 w-4" />
                  Add First Member
                </Button>
              </div>
            </div>
          </Card>

          <!-- No Search Results -->
          <Card
            v-else-if="displayedMembers.length === 0 && searchQuery"
            class="p-8"
          >
            <div class="text-center space-y-4">
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search class="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">No results found</h3>
                <p class="text-sm text-muted-foreground">
                  Try adjusting your search to find what you're looking for
                </p>
              </div>
            </div>
          </Card>

          <!-- Member Cards -->
          <Card
            v-else
            v-for="member in displayedMembers"
            :key="member.id"
            class="p-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <Avatar class="h-12 w-12">
                  <AvatarFallback class="text-sm font-medium">
                    {{
                      getInitials(
                        member.firstName,
                        member.lastName,
                      )
                    }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <h4 class="font-semibold">
                    {{ member.firstName }} {{ member.lastName }}
                  </h4>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm text-muted-foreground">{{
                      member.emailAddress
                    }}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="copyEmail(member.emailAddress)"
                      class="h-6 w-6 p-0"
                    >
                      <Copy class="h-3 w-3" />
                    </Button>
                  </div>
                  <div class="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" class="text-xs">
                      Active
                    </Badge>
                    <span class="text-xs text-muted-foreground">Member since {{
                        formatJoinDate()
                      }}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <MoreHorizontal class="h-4 w-4" />
                    <span class="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuItem @click="editMember()">
                    <Edit class="mr-2 h-4 w-4" />
                    Edit Member
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="viewMemberDetails()">
                    <Eye class="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="deleteMember()"
                    class="text-destructive focus:text-destructive"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Delete Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Fixed Pagination Controls -->
    <div class="shrink-0 mt-6">
      <PaginationControls
        v-if="!searchQuery"
        :current-page="membersStore.currentPage"
        :page-size="membersStore.pageSize"
        :total-items="membersStore.totalItems"
        :loading="membersStore.loading"
        item-name="members"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import type { ICreateMemberReq } from "../../../../packages/types/api/members";
import AddMember from "../components/AddMember.vue";
import PaginationControls from "../components/PaginationControls.vue";
import { useMembersStore } from "../stores/members";

// Store and refs
const membersStore = useMembersStore();
const { members } = storeToRefs(membersStore);

// Component state
const showAddMember = ref(false);
const searchQuery = ref("");

// Computed properties
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

// Display members based on search mode
const displayedMembers = computed(() => {
  // When searching, show filtered results (ignore pagination)
  if (searchQuery.value) {
    return filteredMembers.value;
  }
  // When not searching, show paginated results from store
  return members.value.data;
});

// Watchers
watch(searchQuery, (newQuery, oldQuery) => {
  // Reset pagination when search changes
  if (!newQuery && oldQuery) {
    // User cleared search, reload paginated data
    membersStore.getMembersPaginated();
  }
});

// Lifecycle
onMounted(async () => {
  await membersStore.getMembersPaginated();
});

// Methods
async function toggleSort() {
  const newOrder = membersStore.sortOrder === "asc" ? "desc" : "asc";
  await membersStore.changeSortOrder(newOrder);
}

// Pagination event handlers
async function onPageChange(page: number) {
  await membersStore.goToPage(page);
}

async function onPageSizeChange(pageSize: number) {
  await membersStore.changePageSize(pageSize);
}

async function onNextPage() {
  await membersStore.goToNextPage();
}

async function onPreviousPage() {
  await membersStore.goToPreviousPage();
}

async function onSubmitMember(memberData: ICreateMemberReq) {
  await membersStore.addNewMember(memberData);
  showAddMember.value = false;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatJoinDate(): string {
  // Since we don't have join date in the API, we'll show a placeholder
  // This should be replaced with actual join date from the API
  return "Jan 2024";
}

async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy email");
  }
}

function editMember() {
  // TODO: Implement edit functionality
}

function viewMemberDetails() {
  // TODO: Implement view details functionality
}

function deleteMember() {
  // TODO: Implement delete functionality with confirmation
}
</script>
