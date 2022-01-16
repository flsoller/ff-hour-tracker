<template>
  <div class="sidebar">
    <h1>sidebar</h1>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
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
