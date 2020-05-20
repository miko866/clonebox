import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '../i18n';

// Import components
import Dashboard from '../views/Dashboard';
import Register from '../components/Register';
import Login from '../components/Login';
import Terms from '../components/Terms';

Vue.use(VueRouter);

// Define routes
const routes = [
  {
    path: '/',
    redirect: `/${i18n.locale}/`,
  },
  // Language prefix for everyone
  {
    path: '/:lang',
    component: {
      render(c) {
        return c('router-view');
      },
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        children: [
          {
            path: '/',
            component: Login,
          },
          {
            path: 'login',
            name: 'Login',
            component: Login,
          },
          {
            path: 'register',
            name: 'Register',
            component: Register,
          },
        ],
      },
      {
        path: 'aboutUs',
        name: 'AboutUs',
        component: () => import(/* webpackChunkName: "AboutUs" */ '@/views/AboutUs'),
      },
      {
        path: 'individuals',
        name: 'Individuals',
        component: () => import(/* webpackChunkName: "Individuals" */ '@/views/ForIndividuals'),
      },

      {
        path: 'terms',
        name: 'Terms',
        component: () => import(/* webpackChunkName: "Terms" */ '@/components/Terms'),
      },
      {
        path: 'forgetPassword',
        name: 'ForgetPassword',
        component: () => import(/* webpackChunkName: "Terms" */ '@/views/ForgetPassword'),
      },
      {
        path: '*', // Fullback path
        redirect: '/',
      },
    ],
  },
];

// Use routes
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
