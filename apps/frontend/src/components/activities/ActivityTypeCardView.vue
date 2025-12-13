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
        v-else-if="activityTypes.length === 0 && !isSearching"
        class="p-8"
      >
        <div class="text-center space-y-4">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Palette class="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">No activity types yet</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Get started by adding your first activity type
            </p>
            <Button @click="$emit('add-activity-type')" size="sm">
              <Plus class="mr-2 h-4 w-4" />
              Add First Activity Type
            </Button>
          </div>
        </div>
      </Card>

      <!-- No Search Results -->
      <Card
        v-else-if="activityTypes.length === 0 && isSearching"
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

      <!-- Activity Type Cards -->
      <Card
        v-else
        v-for="activityType in activityTypes"
        :key="activityType.id"
        class="p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ColorIndicator
              :color-code="activityType.colorCode"
              size="lg"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold truncate">
                {{ activityType.activityName }}
              </h4>
              <div class="mt-1">
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ activityType.activityDescription }}
                </p>
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <Badge
                  :variant="
                    activityType.active
                    ? 'secondary'
                    : 'outline'
                  "
                  class="text-xs"
                >
                  {{
                    activityType.active
                    ? "Active"
                    : "Inactive"
                  }}
                </Badge>
                <span class="text-xs text-muted-foreground">Created {{
                    formatDate(activityType.createdAt)
                  }}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0 shrink-0">
                <MoreHorizontal class="h-4 w-4" />
                <span class="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem
                @click="$emit('edit-activity-type', activityType)"
              >
                <Edit class="mr-2 h-4 w-4" />
                Edit Activity Type
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="$emit('view-activity-type', activityType)"
              >
                <Eye class="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                @click="$emit('toggle-status', activityType)"
                class="text-amber-600 focus:text-amber-600"
              >
                <Power class="mr-2 h-4 w-4" />
                {{
                  activityType.active
                  ? "Deactivate"
                  : "Activate"
                }}
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="$emit('delete-activity-type', activityType)"
                class="text-destructive focus:text-destructive"
              >
                <Trash2 class="mr-2 h-4 w-4" />
                Delete Activity Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ColorIndicator from "@/components/ui/ColorIndicator.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IGetActivitiesRes } from "@hour-tracker/core-types/activities";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Palette,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-vue-next";

// Type for individual activity type data from paginated response
type ActivityTypeData = IGetActivitiesRes["data"][0];

// Props
interface Props {
  activityTypes: ActivityTypeData[];
  loading: boolean;
  isSearching: boolean;
}

// Emits
interface Emits {
  (e: "add-activity-type"): void;
  (e: "edit-activity-type", activityType: ActivityTypeData): void;
  (e: "view-activity-type", activityType: ActivityTypeData): void;
  (e: "delete-activity-type", activityType: ActivityTypeData): void;
  (e: "toggle-status", activityType: ActivityTypeData): void;
}

defineProps<Props>();
defineEmits<Emits>();

// Utility function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>
