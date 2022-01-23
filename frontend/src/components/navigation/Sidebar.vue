<template>
  <div class="sidebar">
    <div class="sidebar__element">
      <router-link to="/" class="button button--icon-button-lg"></router-link>
    </div>
    <div class="sidebar__element">
      <router-link
        to="/config"
        class="button button--icon-button-lg"
      ></router-link>
    </div>
    <div class="sidebar__element">
      <router-link
        to="/timelog"
        class="button button--icon-button-lg"
      ></router-link>
    </div>
    <div class="sidebar__element">
      <router-link
        to="/members"
        class="button button--icon-button-lg"
      ></router-link>
    </div>
    <div class="sidebar__element">
      <router-link
        to="/reports"
        class="button button--icon-button-lg"
      ></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
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
