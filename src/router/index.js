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
      path: "/performance",
      name: "Performance",
      component: pages.Performance,
    },
    {
      path: "/demarcate",
      name: "Demarcate",
      component: pages.Demarcate,
    },
    {
      path: "/visualize",
      name: "Visualize",
      component: pages.Visualize,
    },
  ],
});

export default router;
