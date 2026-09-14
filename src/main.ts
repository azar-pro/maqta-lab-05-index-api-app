import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import DiscoverView from './views/DiscoverView.vue';
import BookView from './views/BookView.vue';
import SavedView from './views/SavedView.vue';
import AboutView from './views/AboutView.vue';
import './assets/styles.css';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: DiscoverView },
    { path: '/book/:id', component: BookView },
    { path: '/saved', component: SavedView },
    { path: '/about', component: AboutView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

createApp(App).use(router).mount('#app');
