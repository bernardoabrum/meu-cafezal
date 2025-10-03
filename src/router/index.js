import { createRouter, createWebHistory } from "vue-router";
import * as pages from "@/pages";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/demarcate",
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: pages.Statistics,
    },
    {
      path: "/demarcate",
      name: "Demarcate",
      component: pages.Demarcate,
    },
    {
      path: "/login",
      name: "Login",
      component: pages.Login,
    },
  ],
});

export default router;
