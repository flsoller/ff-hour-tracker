import { createApp } from 'vue';

import 'primevue/resources/themes/vela-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';
import primeVue from 'primevue/config';

import BaseInput from './components/UI/BaseInput.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseDropdown from './components/UI/BaseDropdown.vue';
import BaseTimelogItem from './components/UI/BaseTimeLogItem.vue';

const app = createApp(App);

// register global components here
app.component('base-input', BaseInput);
app.component('base-button', BaseButton);
app.component('base-dropdown', BaseDropdown);
app.component('base-log-item', BaseTimelogItem);

app.use(router);
app.use(primeVue);
app.mount('#app');
