<template>
  <div class="app-container">
    <Toast />
    <DynamicDialog />
    <Sidebar v-if="!$route.meta.hideSidebar" />
    <div class="app-container__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/AppSidebar.vue';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
</script>

<style lang="scss">
@import '@/styles/base/normalize.scss';
@import '@/styles/theme.scss';

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;

  &__content {
    width: 100%;
  }
}
</style>
