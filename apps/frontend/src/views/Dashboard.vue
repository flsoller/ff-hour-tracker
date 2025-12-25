<template>
  <h1 data-testid="dashboard">{{ t("nav.dashboard") }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
