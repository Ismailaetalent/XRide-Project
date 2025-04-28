import { createRouter, createWebHistory } from 'vue-router'

// Auth Guards
const requireAuth = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/auth/login')
  }
}

const requireNoAuth = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('token')
  if (!token) {
    next()
  } else {
    next('/')
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Main Route
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../pages/HomePage.vue')
        },
        {
          path: 'transfer/new',
          name: 'booking',
          component: () => import('../pages/BookingPage.vue')
        },
        {
          path: 'support',
          name: 'support',
          component: () => import('../pages/SupportPage.vue')
        },
        {
          path: 'destinations',
          name: 'destinations',
          component: () => import('../pages/DestinationsPage.vue')
        },
        {
          path: 'feedback',
          name: 'feedback',
          component: () => import('../pages/FeedbackPage.vue')
        },
        {
          path: 'faq',
          name: 'faq',
          component: () => import('../pages/FAQPage.vue')
        },
        // Business page
        {
          path: 'business',
          name: 'for-business',
          component: () => import('../pages/BusinessPage.vue')
        },
        // Agents page
        {
          path: 'agents',
          name: 'for-agents',
          component: () => import('../pages/AgentsPage.vue')
        },
        // Service pages
        {
          path: 'services',
          children: [
            {
              path: 'airport-transfer',
              name: 'airport-transfer',
              component: () => import('../pages/services/AirportTransferPage.vue')
            },
            {
              path: 'vip-transfer',
              name: 'vip-transfer',
              component: () => import('../pages/services/VipTransferPage.vue')
            },
            {
              path: 'bus-rental',
              name: 'bus-rental',
              component: () => import('../pages/services/BusRentalPage.vue')
            }
          ]
        },
        // Policy pages
        {
          path: 'terms',
          name: 'terms',
          component: () => import('../pages/policy/TermsPage.vue')
        },
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import('../pages/policy/PrivacyPage.vue')
        }
      ]
    },
    // Auth Routes
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../pages/auth/LoginPage.vue'),
          beforeEnter: requireNoAuth
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../pages/auth/RegisterPage.vue'),
          beforeEnter: requireNoAuth
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../pages/auth/ForgotPasswordPage.vue'),
          beforeEnter: requireNoAuth
        }
      ]
    },
    // Passenger Dashboard Routes
    {
      path: '/passenger',
      component: () => import('../layouts/DashboardLayout.vue'),
      beforeEnter: requireAuth,
      children: [
        {
          path: 'dashboard',
          name: 'passenger-dashboard',
          component: () => import('../pages/passenger/DashboardPage.vue')
        },
        {
          path: 'rides',
          name: 'passenger-rides',
          component: () => import('../pages/passenger/RidesPage.vue')
        },
        {
          path: 'rides/:id',
          name: 'ride-details',
          component: () => import('../pages/passenger/RideDetailsPage.vue')
        },
        {
          path: 'profile',
          name: 'passenger-profile',
          component: () => import('../pages/passenger/ProfilePage.vue')
        }
      ]
    },
    // Driver Dashboard Routes
    {
      path: '/driver',
      component: () => import('../layouts/DriverLayout.vue'),
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          name: 'driver-signup',
          component: () => import('../pages/driver/SignupPage.vue')
        },
        {
          path: 'dashboard',
          name: 'driver-dashboard',
          component: () => import('../pages/driver/DashboardPage.vue')
        },
        {
          path: 'rides',
          name: 'driver-rides',
          component: () => import('../pages/driver/RidesPage.vue')
        },
        {
          path: 'rides/:id',
          name: 'driver-ride-details',
          component: () => import('../pages/driver/RideDetailsPage.vue')
        },
        {
          path: 'availability',
          name: 'driver-availability',
          component: () => import('../pages/driver/AvailabilityPage.vue')
        },
        {
          path: 'vehicle',
          name: 'driver-vehicle',
          component: () => import('../pages/driver/VehiclePage.vue')
        },
        {
          path: 'profile',
          name: 'driver-profile',
          component: () => import('../pages/driver/ProfilePage.vue')
        },
        {
          path: 'earnings',
          name: 'driver-earnings',
          component: () => import('../pages/driver/EarningsPage.vue')
        }
      ]
    },
    // Admin Dashboard Routes (optional, can be expanded later)
    /*
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      beforeEnter: requireAuth,
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../pages/admin/DashboardPage.vue')
        }
      ]
    },
    */
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue')
    }
  ]
})

export default router
