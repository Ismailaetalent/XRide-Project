import { createRouter, createWebHistory } from 'vue-router';
import WelcomeSection from '../components/WelcomeSection.vue';
import PassagerSection from '../components/PassagerSection.vue';
import ChauffeurSection from '../components/ChauffeurSection.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Users from '../components/UserManager.vue';
import DriverDashboard from '../pages/DriverDashboard.vue';
import Map from '../pages/PassengerMap.vue';
import { jwtDecode } from 'jwt-decode';
import { useQuasar } from 'quasar';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomeSection,
  },
  {
    path: '/passager',
    name: 'Passager',
    component: PassagerSection,
    meta: { allowedTypes: ['PASSAGER'] }, // Pas de requiresAuth pour permettre l'accès non authentifié
  },
  {
    path: '/chauffeur',
    name: 'Chauffeur',
    component: ChauffeurSection,
    meta: { allowedTypes: ['CHAUFFEUR'] },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register/:typeUser(passager|chauffeur)?',
    name: 'Register',
    component: Register,
    props: true,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, allowedTypes: ['ADMIN'] },
  },
  {
    path: '/driver-dashboard',
    name: 'DriverDashboard',
    component: DriverDashboard,
    meta: { requiresAuth: true, allowedTypes: ['CHAUFFEUR'] },
  },
  {
    path: '/map',
    name: 'Map',
    component: Map,
    meta: { requiresAuth: true, allowedTypes: ['PASSAGER'] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const $q = useQuasar();
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    $q.notify({
      type: 'warning',
      message: 'Veuillez vous connecter pour accéder à cette page.',
    });
    next('/login');
  } else if (to.meta.allowedTypes && token) {
    try {
      const decoded = jwtDecode(token);
      if (!to.meta.allowedTypes.includes(decoded.typeUser)) {
        $q.notify({
          type: 'negative',
          message: 'Accès non autorisé pour votre type d’utilisateur.',
        });
        switch (decoded.typeUser) {
          case 'ADMIN':
            next('/users');
            break;
          case 'CHAUFFEUR':
            next('/driver-dashboard');
            break;
          case 'PASSAGER':
            next('/map');
            break;
          default:
            next('/');
        }
      } else {
        next();
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Session invalide. Veuillez vous reconnecter.',
      });
      localStorage.removeItem('token');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;