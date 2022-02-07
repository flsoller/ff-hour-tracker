<template>
  <Dropdown :listItems="list" />
</template>

<script lang="ts" setup>
import Dropdown from '@/components/AppDropdown.vue';

const list = ['Name One', 'Name Two', 'Name Three'];
</script>
