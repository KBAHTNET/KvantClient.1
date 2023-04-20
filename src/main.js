import { createApp } from 'vue';
import App from './App.vue';
//import './registerServiceWorker';
import router from './router';
import store from './store';
//import './sw';
//import './swapp';

createApp(App).use(store).use(router).mount('#app');

const s = document.createElement('script');
s.src = '/videoplayer.js';
document.body.appendChild(s);
