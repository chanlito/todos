import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

function loadView(view: string) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}`);
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: loadView('Home'),
  },
  {
    path: '/auth/callback',
    name: 'callback',
    component: loadView('Callback'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
