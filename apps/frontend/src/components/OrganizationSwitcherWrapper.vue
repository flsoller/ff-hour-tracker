<script setup lang="ts">
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useClerk } from "@clerk/vue";
import { Building2 } from "lucide-vue-next";
import { computed } from "vue";

const { state } = useSidebar();
const clerk = useClerk();

const isCollapsed = computed(() => state.value === "collapsed");
const orgName = computed(() =>
  clerk.value?.organization?.name || "Organization"
);

function openOrganizationProfile() {
  clerk.value?.openOrganizationProfile();
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        v-if="isCollapsed"
        size="lg"
        class="justify-center"
        :tooltip="orgName"
        @click="openOrganizationProfile"
      >
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 class="size-4" />
        </div>
      </SidebarMenuButton>
      <SidebarMenuButton v-else size="lg" @click="openOrganizationProfile">
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 class="size-4" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">{{ orgName }}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
