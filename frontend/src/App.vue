<template>
  <div class="app-container">
    <Sidebar />
    <div class="app-container__content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '@/components/navigation/Sidebar.vue';

export default defineComponent({
  components: {
    Sidebar,
  },
});
</script>

<style lang="scss">
@import '@/styles/_css-reset.scss';
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
