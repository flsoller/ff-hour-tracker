<template>
  <div class="hidden lg:block flex-1 min-h-0">
    <div class="rounded-lg border bg-card overflow-hidden h-full">
      <div class="h-full overflow-auto">
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-card border-b">
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-12 bg-card"></TableHead>
              <TableHead class="font-semibold bg-card">Activity Type</TableHead>
              <TableHead class="font-semibold bg-card">Description</TableHead>
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
                    Loading activity types...
                  </p>
                </div>
              </TableCell>
            </TableRow>

            <!-- Empty State -->
            <TableRow
              v-else-if="activityTypes.length === 0 && !isSearching"
              class="hover:bg-transparent"
            >
              <TableCell :colspan="5" class="text-center py-12">
                <div class="flex flex-col items-center space-y-4">
                  <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Palette class="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div class="text-center">
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
              </TableCell>
            </TableRow>

            <!-- No Search Results -->
            <TableRow
              v-else-if="activityTypes.length === 0 && isSearching"
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

            <!-- Activity Type Rows -->
            <TableRow
              v-else
              v-for="activityType in activityTypes"
              :key="activityType.id"
              class="hover:bg-muted/50 transition-colors"
            >
              <TableCell class="w-12">
                <ColorIndicator
                  :color-code="activityType.colorCode"
                  size="md"
                />
              </TableCell>
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-medium">{{
                    activityType.activityName
                  }}</span>
                  <span class="text-sm text-muted-foreground">Created
                    {{ formatDate(activityType.createdAt) }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div class="max-w-md">
                  <span class="text-sm text-muted-foreground">{{
                    activityType.activityDescription
                  }}</span>
                </div>
              </TableCell>
              <TableCell>
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
                    <DropdownMenuItem
                      @click="
                        $emit(
                          'edit-activity-type',
                          activityType,
                        )
                      "
                    >
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Activity Type
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="
                        $emit(
                          'view-activity-type',
                          activityType,
                        )
                      "
                    >
                      <Eye class="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      @click="
                        $emit(
                          'toggle-status',
                          activityType,
                        )
                      "
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
                      @click="
                        $emit(
                          'delete-activity-type',
                          activityType,
                        )
                      "
                      class="text-destructive focus:text-destructive"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Delete Activity Type
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ColorIndicator from "@/components/ui/ColorIndicator.vue";
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
