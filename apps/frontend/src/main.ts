import { createPinia } from "pinia";
import { createApp } from "vue";

import "primeicons/primeicons.css";

import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import DialogService from "primevue/dialogservice";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(DialogService);
app.mount("#app");
