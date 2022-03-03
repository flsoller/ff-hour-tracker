<template>
  <base-dropdown
    :options="members"
    id="memberSelect"
    for="memberSelect"
    labelText="Member"
    v-model="selectedMember"
  ></base-dropdown>
  <time-log-form></time-log-form>

  <base-log-item
    v-for="log in logEntries"
    :key="log.member"
    :member="log.member"
    :date="log.date"
    :entry="log.entry"
  ></base-log-item>
</template>

<script lang="ts" setup>
//TODO have the base-log item component be displayed properly again
//TODO extract all relevant props and methods in the parent (TimeLogging.vue) and then use provide / inject to make use of them in child component
//TODO investigate and fix the need for double clicking the dropdowns

import TimeLogForm from '../components/UI/TimeLogForm.vue'
import Dropdown from '@/components/AppDropdown.vue';
import { LogRecord } from '../../../types/logRecord.interface'
import { ref } from 'vue';

const logEntries = ref<LogRecord[]>([])
const selectedMember = ref('')
const members = [{ text: 'Member 1', value: 'Member 1' }, { text: 'Member 2', value: 'Member 2' }];
</script>

<style lang="scss">
h2 {
  color: $white-blue;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
