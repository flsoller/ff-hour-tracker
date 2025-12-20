import { clerkPlugin } from "@clerk/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "./style.css";
import { shadcn } from "@clerk/themes";
import App from "./App.vue";
import router from "./router";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(clerkPlugin, {
  publishableKey: CLERK_PUBLISHABLE_KEY,
  appearance: {
    theme: shadcn,
  },
});
app.use(router);
app.mount("#app");
