<template>
  <div class="w-full">
    <div class="flex h-14 items-center px-4">
      <div class="flex flex-1 items-center justify-end right-0">
        <div class="flex items-center space-x-2">
          <!-- Future left-side nav items go here -->
        </div>
        <div class="flex items-center space-x-2">
          <DarkModeSelect />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkModeSelect from "./DarkModeSelect.vue";
</script>
