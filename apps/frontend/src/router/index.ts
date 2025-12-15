import Configuration from "@/views/Configuration.vue";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import Members from "@/views/Members.vue";
import Reports from "@/views/Reports.vue";
import SignUp from "@/views/SignUp.vue";
import TimeLogging from "@/views/TimeLogging.vue";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  /**
   * Default route to dashboard
   */
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      protected: true,
    },
  },
  /**
   * Configuration page
   */
  {
    path: "/config",
    name: "Configuration",
    component: Configuration,
    meta: {
      protected: true,
    },
  },
  /**
   * Time logging page
   */
  {
    path: "/timelog",
    name: "Time Logging",
    component: TimeLogging,
    meta: {
      protected: true,
    },
  },
  /**
   * Member management page
   */
  {
    path: "/members",
    name: "Member Management",
    component: Members,
    meta: {
      protected: true,
    },
  },
  /**
   * Reports page
   */
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    meta: {
      protected: true,
    },
  },
  /**
   * Login page
   */
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideSidebar: true,
    },
  },
  /**
   * Sign up page
   */
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      hideSidebar: true,
    },
  },
  { path: "/:pathMatch(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
