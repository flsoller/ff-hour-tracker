<template>
  <nav class="sidebar" data-testid="sidebar">
    <router-link
      :to="sidebarItem.routerLink"
      v-for="sidebarItem in sidebarContent"
      class="sidebar__item"
    >
      <i class="sidebar__item__icon pi" :class="sidebarItem.icon"></i>
      <div class="sidebar__item__label">
        <span>{{ sidebarItem.label }}</span>
      </div>
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface SidebarContent {
  routerLink: string;
  icon: string;
  label: string;
}

const sidebarContent = ref<SidebarContent[]>([
  {
    routerLink: '/',
    icon: 'pi-home',
    label: 'Dashboard',
  },
  {
    routerLink: '/timelog',
    icon: 'pi-clock',
    label: 'Timesheet',
  },
  {
    routerLink: '/config',
    icon: 'pi-cog',
    label: 'Configuration',
  },
  {
    routerLink: '/members',
    icon: 'pi-users',
    label: 'Members',
  },
  {
    routerLink: '/reports',
    icon: 'pi-file-o',
    label: 'Reports',
  },
]);
</script>

<style lang="scss" scoped>
.sidebar {
  background: $dark-3;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  color: $dark-2-light-accent;

  &__item {
    display: flex;
    text-decoration: none;
    padding: 1.5rem;

    &:visited {
      color: inherit;
    }

    &:hover {
      background-color: $dark-2-dark-accent;
    }

    &__icon {
      min-width: 1.5rem;
      font-size: 1.5rem;

      @media (max-width: $medium) {
        min-width: 0;
        font-size: 1.25rem;
      }
    }

    @media (max-width: $medium) {
      flex-direction: column;
      align-items: center;
    }

    &__label {
      align-self: center;
      padding-left: 1rem;

      @media (max-width: $small) {
        display: none;
      }

      @media (max-width: $medium) {
        padding-left: 0;
        padding-top: 0.5rem;
      }
    }
  }

  .router-link-active {
    color: $white-blue;
  }
}
</style>
