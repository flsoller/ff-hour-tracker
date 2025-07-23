/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const currentDir = dirname(fileURLToPath(import.meta.url));

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
        additionalData: ` @use "${join(currentDir, "src/styles/base/imports.scss")}" as *; `,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__test__/mocks/setup.ts"],
  },
});
