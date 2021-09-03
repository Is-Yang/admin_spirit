import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/device'
    },
    {
      path: '/login',
      meta: {
        showMenu: false
      },
      component: () => import('../views/Login.vue')
    },
    {
      path: '/device',
      meta: {
        showMenu: true
      },
      component: () => import('../views/device/DeviceManage.vue')
    }, {
      path: "/device/add",
      meta: {
        showMenu: true,
      },
      component: () =>
          import ("../views/device/DeviceAdd.vue"),
    }, {
      path: '/feedback',
      meta: {
        showMenu: true
      },
      component: () => import('../views/feedback/FeedbackList.vue')
    }
  ]
});

export default router;