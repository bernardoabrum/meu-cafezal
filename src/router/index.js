import { createRouter, createWebHistory } from "vue-router";
import * as pages from "@/pages";
import { useStore } from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "Home",
      component: pages.Home,
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
    {
      path: "/notfound",
      name: "NotFound",
      component: pages.NotFound,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/notfound",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { getIsAuthenticated } = useStore();
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedUser = getIsAuthenticated();

  if (authRequired && !loggedUser) {
    return next("/login");
  }

  if (loggedUser && to.path === "/login") {
    return next("/home");
  }

  next();
});

export default router;
