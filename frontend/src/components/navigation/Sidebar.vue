<template>
  <div class="sidebar">
    <Button class="sidebar__element button button--icon-button-lg"></Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/Button.vue';

export default defineComponent({
  components: {
    Button,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
.sidebar {
  width: 7rem;
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
