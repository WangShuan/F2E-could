import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "favorite",
        name: "Favorite",
        component: () => import("../views/Favorite.vue"),
      },
      {
        path: "trash",
        name: "Trash",
        component: () => import("../views/Trash.vue"),
      },
      {
        path: "folder/:folderName",
        name: "Folder",
        component: () => import("../views/Folder.vue"),
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "*",
    component: () => import("../views/404.vue"),
    alias: "/404",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
