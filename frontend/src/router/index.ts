import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user';

// View imports
import Dashboard from '@/views/Dashboard.vue';
import Configuration from '@/views/Configuration.vue';
import TimeLogging from '@/views/TimeLogging.vue';
import Members from '@/views/Members.vue';
import Reports from '@/views/Reports.vue';
import Login from '@/views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  /**
   * Default route to dashboard
   */
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      protected: true,
    },
  },
  /**
   * Configuration page
   */
  {
    path: '/config',
    name: 'Configuration',
    component: Configuration,
    meta: {
      protected: true,
    },
  },
  /**
   * Time logging page
   */
  {
    path: '/timelog',
    name: 'Time Logging',
    component: TimeLogging,
    meta: {
      protected: true,
    },
  },
  /**
   * Member management page
   */
  {
    path: '/members',
    name: 'Member Management',
    component: Members,
    meta: {
      protected: true,
    },
  },
  /**
   * Reports page
   */
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      protected: true,
    },
  },
  /**
   * Login page
   */
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      hideSidebar: true,
    },
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

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.protected && !userStore.isLoggedIn) next('/login');
  else next();
});

export default router;
