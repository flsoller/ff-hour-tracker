<template>
  <div class="flex h-14 items-center justify-end px-4 space-x-6">
    <LanguageSelect />
    <DarkModeSelect />
    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>
</template>

<script setup lang="ts">
import { SignedIn, UserButton } from "@clerk/vue";
import DarkModeSelect from "./DarkModeSelect.vue";
import LanguageSelect from "./LanguageSelect.vue";
</script>
