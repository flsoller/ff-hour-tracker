import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'primevue/resources/themes/vela-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';
import primeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(primeVue);
app.use(DialogService);
app.mount('#app');
