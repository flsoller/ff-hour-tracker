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
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
});

const data = computed(() => ({
  navMain: [
    {
      title: t("nav.dashboard"),
      url: "/",
      icon: Home,
      isActive: true,
      testId: "dashboardLink",
    },
    {
      title: t("nav.timesheet"),
      url: "/timelog",
      icon: Clock,
      testId: "timesheetLink",
    },
    {
      title: t("nav.members"),
      url: "/members",
      icon: User,
      testId: "membersLink",
    },
    {
      title: t("nav.configuration"),
      url: "/config",
      icon: Settings,
      testId: "configLink",
    },
    {
      title: t("nav.reports"),
      url: "/reports",
      icon: Inbox,
      testId: "reportsLink",
    },
  ],
  navSecondary: [
    {
      title: t("nav.support"),
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: t("nav.feedback"),
      url: "#",
      icon: Send,
    },
  ],
}));
</script>
