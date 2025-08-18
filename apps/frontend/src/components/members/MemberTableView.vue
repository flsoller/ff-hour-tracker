<template>
  <div class="hidden lg:block flex-1 min-h-0">
    <div class="rounded-lg border bg-card overflow-hidden h-full">
      <div class="h-full overflow-auto">
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-card border-b">
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-12 bg-card"></TableHead>
              <TableHead class="font-semibold bg-card">Member</TableHead>
              <TableHead class="font-semibold bg-card">Email Address</TableHead>
              <TableHead class="font-semibold bg-card">Status</TableHead>
              <TableHead class="w-10 bg-card"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Loading State -->
            <TableRow v-if="loading" class="hover:bg-transparent">
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
              v-else-if="members.length === 0 && !isSearching"
              class="hover:bg-transparent"
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
                    <Button @click="$emit('add-member')" size="sm">
                      <Plus class="mr-2 h-4 w-4" />
                      Add First Member
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <!-- No Search Results -->
            <TableRow
              v-else-if="members.length === 0 && isSearching"
              class="hover:bg-transparent"
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
                      Try adjusting your search to find what you're looking for
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <!-- Member Rows -->
            <TableRow
              v-else
              v-for="member in members"
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
                      $emit(
                        'copy-email',
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
                    <DropdownMenuItem @click="$emit('edit-member', member)">
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Member
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="$emit('view-member', member)">
                      <Eye class="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      @click="$emit('delete-member', member)"
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
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-vue-next";
import type { IGetMembersPaginatedRes } from "../../../../../packages/types/api/members";
import { useMemberActions } from "../../composables/useMemberActions";

// Type for individual member data from paginated response
type MemberData = IGetMembersPaginatedRes["data"][0];

// Props
interface Props {
  members: MemberData[];
  loading: boolean;
  isSearching: boolean;
}

// Emits
interface Emits {
  (e: "add-member"): void;
  (e: "copy-email", email: string): void;
  (e: "edit-member", member: MemberData): void;
  (e: "view-member", member: MemberData): void;
  (e: "delete-member", member: MemberData): void;
}

defineProps<Props>();
defineEmits<Emits>();

// Use member actions composable for utilities
const { getInitials, formatJoinDate } = useMemberActions();
</script>
