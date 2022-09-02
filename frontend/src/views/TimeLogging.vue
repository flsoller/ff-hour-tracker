<template>
  <calendar v-model="value" selectionMode="multiple" dateFormat="dd/mm/yy" :minDate="currentDate"></calendar>
  <div>{{ value }}</div>
</template>

<script lang="ts" setup>
//TODO have the base-log item component be displayed properly again
//TODO extract all relevant props and methods in the parent (TimeLogging.vue) and then use provide / inject to make use of them in child component
//TODO investigate and fix the need for double clicking the dropdowns
import calendar from 'primevue/calendar';
import { ref } from 'vue';

// add constants here
const currentDate = new Date

//add refs and reactive objs here
const value = ref(undefined)
</script>

<style lang="scss">
</style>
