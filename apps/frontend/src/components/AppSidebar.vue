<template>
  <Sidebar v-bind="props" collapsible="icon" data-testid="sidebar">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <OrganizationSwitcherWrapper />
          <SidebarMenuButton size="lg" as-child> </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import NavMain from "@/components/NavMain.vue";
import NavSecondary from "@/components/NavSecondary.vue";
import OrganizationSwitcherWrapper from "@/components/OrganizationSwitcherWrapper.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
} from "@/components/ui/sidebar";
import {
  Clock,
  Home,
  Inbox,
  LifeBuoy,
  Send,
  Settings,
  User,
} from "lucide-vue-next";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
});

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
      testId: "dashboardLink",
    },
    {
      title: "Timesheet",
      url: "/timelog",
      icon: Clock,
      testId: "timesheetLink",
    },
    {
      title: "Members",
      url: "/members",
      icon: User,
      testId: "membersLink",
    },
    {
      title: "Configuration",
      url: "/config",
      icon: Settings,
      testId: "configLink",
    },
    {
      title: "Reports",
      url: "/reports",
      icon: Inbox,
      testId: "reportsLink",
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
</script>
