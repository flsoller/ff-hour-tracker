/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Path alias to import components via @/...
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Only import variables/mixins here
        additionalData: ` @import "src/styles/base/imports.scss"; `,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
    },
    setupFiles: ["./src/__test__/mocks/setup.ts"],
  },
});
