import { createRouter, createWebHistory } from "vue-router";
import * as pages from "@/pages";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      path: "/visualize",
      name: "Visualize",
      component: pages.Visualize,
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: pages.Statistics,
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

let authInitialized = false;

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  if (!authInitialized) {
    authInitialized = true;

    onAuthStateChanged(auth, () => {
      next(to.fullPath);
    });

    return;
  }

  const user = auth.currentUser;
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !user) {
    return next("/login");
  }

  if (user && to.path === "/login") {
    return next("/home");
  }

  return next();
});

export default router;
