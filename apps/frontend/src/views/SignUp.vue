<template>
  <div class="flex w-full h-screen items-center justify-center px-4">
    <SignUp :appearance="clerkAppearance" />
  </div>
</template>

<script setup lang="ts">
import { SignUp } from "@clerk/vue";

const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorBackground: "var(--accent)",
    colorInputBackground: "var(--background)",
    colorInputText: "var(--foreground)",
    colorNeutral: "var(--muted-foreground)",
    borderRadius: "var(--radius)",
  },
  elements: {
    rootBox: "w-full max-w-md",
    card: "bg-card border border-border shadow-sm",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton:
      "bg-secondary text-secondary-foreground border border-border hover:bg-accent",
    formFieldLabel: "text-foreground",
    formFieldInput: "bg-input border-border text-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
  },
};
</script>
