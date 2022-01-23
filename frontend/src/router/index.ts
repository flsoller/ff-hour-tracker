import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// View imports
import Dashboard from '@/views/Dashboard.vue';
import Configuration from '@/views/Configuration.vue';
import TimeLogging from '@/views/TimeLogging.vue';
import Members from '@/views/Members.vue';
import Reports from '@/views/Reports.vue';

const routes: Array<RouteRecordRaw> = [
  /**
   * Default route to dashboard
   */
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  /**
   * Configuration page
   */
  {
    path: '/config',
    name: 'Configuration',
    component: Configuration,
  },
  /**
   * Time logging page
   */
  {
    path: '/timelog',
    name: 'Time Logging',
    component: TimeLogging,
  },
  /**
   * Member management page
   */
  {
    path: '/members',
    name: 'Member Management',
    component: Members,
  },
  /**
   * Reports page
   */
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
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
