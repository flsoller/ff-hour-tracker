<template>
  <div class="hidden lg:block flex-1 min-h-0">
    <div class="rounded-lg border bg-card overflow-hidden h-full">
      <div class="h-full overflow-auto">
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-card border-b">
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-12 bg-card"></TableHead>
              <TableHead class="font-semibold bg-card">{{
                t("configuration.tableHeaders.activityType")
              }}</TableHead>
              <TableHead class="font-semibold bg-card">{{
                t("configuration.tableHeaders.description")
              }}</TableHead>
              <TableHead class="font-semibold bg-card">{{
                t("configuration.tableHeaders.status")
              }}</TableHead>
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
                    {{ t("configuration.states.loading") }}
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
                    <h3 class="text-lg font-semibold">
                      {{
                        t(
                          "configuration.emptyState.title",
                        )
                      }}
                    </h3>
                    <p class="text-sm text-muted-foreground mb-4">
                      {{
                        t(
                          "configuration.emptyState.description",
                        )
                      }}
                    </p>
                    <Button @click="$emit('add-activity-type')" size="sm">
                      <Plus class="mr-2 h-4 w-4" />
                      {{
                        t(
                          "configuration.emptyState.button",
                        )
                      }}
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
                      {{
                        t(
                          "configuration.noSearchResults.title",
                        )
                      }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      {{
                        t(
                          "configuration.noSearchResults.description",
                        )
                      }}
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
                  <span class="text-sm text-muted-foreground">{{
                    t("configuration.createdAt", {
                      date: formatDate(
                        activityType.createdAt,
                      ),
                    })
                  }}</span>
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
                    ? t("configuration.states.active")
                    : t("configuration.states.inactive")
                  }}
                </Badge>
              </TableCell>
              <TableCell class="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">{{
                        t(
                          "configuration.actions.openMenu",
                        )
                      }}</span>
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
                      {{
                        t(
                          "configuration.actions.edit",
                        )
                      }}
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
                        ? t(
                          "configuration.actions.deactivate",
                        )
                        : t(
                          "configuration.actions.activate",
                        )
                      }}
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
  MoreHorizontal,
  Palette,
  Plus,
  Power,
  Search,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

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
  (e: "toggle-status", activityType: ActivityTypeData): void;
}

defineProps<Props>();
defineEmits<Emits>();

// Utility function to format dates with locale support
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>
