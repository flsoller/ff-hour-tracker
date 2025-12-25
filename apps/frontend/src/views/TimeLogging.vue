<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t("nav.timesheet") }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
