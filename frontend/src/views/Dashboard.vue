<template>
  <h1>Dashboard</h1>

 <n-button type="primary">
      Primary
  </n-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
 import { NButton } from 'naive-ui'

export default defineComponent({
  name: 'Dashboard',
  components: {
    NButton
  },
});
</script>
