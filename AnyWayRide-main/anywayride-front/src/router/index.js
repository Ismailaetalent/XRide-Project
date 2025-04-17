import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import VoitureManager from '../components/VoitureManager.vue';
import TypeVoitureManager from '../components/TypeVoitureManager.vue';
import UserManager from '../components/UserManager.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/voitures',
    name: 'VoitureManager',
    component: VoitureManager,
    meta: { requiresAuth: true },
  },
  {
    path: '/type-voitures',
    name: 'TypeVoitureManager',
    component: TypeVoitureManager,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'UserManager',
    component: UserManager,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;