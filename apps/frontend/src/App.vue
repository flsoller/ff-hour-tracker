<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Toaster richColors />
    <SidebarProvider
      v-if="!$route.meta.hideSidebar"
      class="flex-1 flex overflow-hidden"
    >
      <AppSidebar />
      <SidebarInset class="flex-1 flex flex-col overflow-hidden">
        <header class="flex h-16 shrink-0 items-center gap-2">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
            />
            <NavBar />
          </div>
        </header>
        <main class="flex-1 flex flex-col overflow-hidden p-4 pt-0">
          <router-view class="flex-1 flex flex-col overflow-hidden" />
        </main>
      </SidebarInset>
    </SidebarProvider>
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <header class="border-grid z-50 w-full border-b shrink-0">
        <NavBar />
      </header>
      <main class="flex-1 flex flex-col overflow-hidden">
        <RouterView class="flex-1 flex flex-col overflow-hidden" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css"; // vue-sonner v2 requires this import
import NavBar from "./components/NavBar.vue";
</script>

<style lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;

  &__content {
    width: 100%;
  }
}
</style>
