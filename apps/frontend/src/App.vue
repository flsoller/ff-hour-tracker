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
import Sidebar from "@/components/AppSidebar.vue";
import DynamicDialog from "primevue/dynamicdialog";
import Toast from "primevue/toast";
</script>

<style lang="scss">
@use "@/styles/base/normalize.scss" as *;
@use "@/styles/theme.scss" as *;

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;

  &__content {
    width: 100%;
  }
}
</style>
