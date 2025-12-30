<template>
  <div class="relative flex flex-col w-full h-screen overflow-hidden">
    <AnimatedBackground />
    <header class="relative z-50 w-full shrink-0">
      <NavBar />
    </header>
    <main class="relative z-10 flex-1 flex items-center justify-center px-4">
      <SignUp />
    </main>
  </div>
</template>

<script setup lang="ts">
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import NavBar from "@/components/NavBar.vue";
import { SignUp } from "@clerk/vue";
</script>
