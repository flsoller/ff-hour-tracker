<template>
  <div class="lg:hidden flex-1 min-h-0 overflow-y-auto">
    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <Card v-for="i in 3" :key="i" class="p-4">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 bg-muted rounded-full animate-pulse"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-muted rounded animate-pulse"></div>
              <div class="h-3 bg-muted rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <Card
        v-else-if="members.length === 0 && !isSearching"
        class="p-8"
      >
        <div class="text-center space-y-4">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users class="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">
              {{ t("members.emptyState.title") }}
            </h3>
            <p class="text-sm text-muted-foreground mb-4">
              {{ t("members.emptyState.description") }}
            </p>
            <Button @click="$emit('add-member')" size="sm">
              <Plus class="mr-2 h-4 w-4" /> {{ t("members.emptyState.button") }}
            </Button>
          </div>
        </div>
      </Card>

      <!-- No Search Results -->
      <Card
        v-else-if="members.length === 0 && isSearching"
        class="p-8"
      >
        <div class="text-center space-y-4">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search class="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">
              {{ t("members.noSearchResults.title") }}
            </h3>
            <p class="text-sm text-muted-foreground">
              {{ t("members.noSearchResults.description") }}
            </p>
          </div>
        </div>
      </Card>

      <!-- Member Cards -->
      <Card
        v-else
        v-for="member in members"
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
                  @click="$emit('copy-email', member.emailAddress)"
                  class="h-6 w-6 p-0"
                >
                  <Copy class="h-3 w-3" />
                </Button>
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" class="text-xs">
                  {{ t("members.states.active") }}
                </Badge>
                <span class="text-xs text-muted-foreground">{{
                  t("members.memberSince", {
                    date: formatJoinDate(),
                  })
                }}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <MoreHorizontal class="h-4 w-4" />
                <span class="sr-only">{{ t("members.actions.openMenu") }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem @click="$emit('edit-member', member)">
                <Edit class="mr-2 h-4 w-4" /> {{ t("members.actions.edit") }}
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('view-member', member)">
                <Eye class="mr-2 h-4 w-4" />
                {{ t("members.actions.viewDetails") }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                @click="$emit('delete-member', member)"
                class="text-destructive focus:text-destructive"
              >
                <Trash2 class="mr-2 h-4 w-4" />
                {{ t("members.actions.delete") }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
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
import type { IGetMembersPaginatedRes } from "@hour-tracker/core-types/members";
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
import { useI18n } from "vue-i18n";
import { useMemberActions } from "../../composables/useMemberActions";

const { t } = useI18n();

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
