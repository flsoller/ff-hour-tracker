import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashbaord from '@/views/Dashboard.vue';

const routes: Array<RouteRecordRaw> = [
  /**
   * Default route to dashboard
   */
  {
    path: '/',
    name: 'Dashboard',
    component: Dashbaord,
  },
  /**
   * NotFoundComponent for all unmactched routes, to be implemented
   */
  // { path: '/:pathMatch(.*)', component: NotFoundComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
