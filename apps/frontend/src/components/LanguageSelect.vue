<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSupportedLocales, setLocale, type SupportedLocale } from "@/i18n";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const supportedLocales = getSupportedLocales();

const currentLocaleCode = computed(() => locale.value.toUpperCase());

function changeLanguage(newLocale: string) {
  const typedLocale = newLocale as SupportedLocale;
  locale.value = newLocale;
  setLocale(typedLocale);
  window.location.reload();
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="cursor-pointer gap-2">
        <Icon icon="radix-icons:globe" class="h-[1.2rem] w-[1.2rem]" />
        <span class="text-sm font-medium">{{ currentLocaleCode }}</span>
        <span class="sr-only">Select language</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="space-y-1 p-1">
      <DropdownMenuItem
        v-for="loc in supportedLocales"
        :key="loc.code"
        @click="changeLanguage(loc.code)"
        :class="{ 'bg-accent': locale === loc.code }"
      >
        {{ loc.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
