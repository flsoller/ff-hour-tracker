<template>
  <nav class="sidebar">
    <router-link
      :to="sidebarItem.routerLink"
      v-for="sidebarItem in sidebarContent"
      class="sidebar__item"
    >
      <font-awesome-icon
        :icon="sidebarItem.icon"
        size="lg"
        class="sidebar__item__icon"
      />
      <div class="sidebar__item__label">
        <span>{{ sidebarItem.label }}</span>
      </div>
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHouse,
  faTools,
  faUserClock,
  faUsers,
  faChartLine,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarContent {
  routerLink: string;
  icon: IconDefinition;
  label: string;
}

const sidebarContent = ref<SidebarContent[]>([
  {
    routerLink: '/',
    icon: faHouse,
    label: 'Dashboard',
  },
  {
    routerLink: '/timelog',
    icon: faUserClock,
    label: 'Timesheet',
  },
  {
    routerLink: '/config',
    icon: faTools,
    label: 'Configuration',
  },
  {
    routerLink: '/members',
    icon: faUsers,
    label: 'Members',
  },
  {
    routerLink: '/reports',
    icon: faChartLine,
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

      @media (max-width: $medium) {
        min-width: 0;
      }
    }

    @media (max-width: $medium) {
      flex-direction: column;
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
