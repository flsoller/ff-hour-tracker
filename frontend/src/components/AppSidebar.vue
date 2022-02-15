<template>
  <div class="sidebar">
    <div
      class="sidebar__element"
      v-for="sidebarItem in sidebarContent"
      ref="sidebarContent"
    >
      <router-link :to="sidebarItem.routerLink">
        <app-button :buttonType="ButtonTypes.ICON_BTN_LG" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AppButton from '@/components/AppButton.vue';
import { ButtonTypes } from '../types/Button';

interface SidebarContent {
  routerLink: string;
}

const sidebarContent: any = ref<SidebarContent[]>([
  {
    routerLink: '/',
  },
  {
    routerLink: '/config',
  },
  {
    routerLink: '/timelog',
  },
  {
    routerLink: '/members',
  },
  {
    routerLink: '/reports',
  },
]);
</script>

<style lang="scss">
.sidebar {
  width: 7rem;
  min-width: 5.5rem;
  background: $dark-3;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__element {
    padding-top: 2.5rem;

    &__icon {
      color: $white-blue;
    }

    &:last-child {
      padding-bottom: 2.5rem;
    }
  }
}
</style>
