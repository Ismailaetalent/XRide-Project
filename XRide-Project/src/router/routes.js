
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'transfers', component: () => import('pages/TransfersPage.vue') },
      { path: 'rides', component: () => import('pages/RidesPage.vue') },
      { path: 'delivery', component: () => import('pages/DeliveryPage.vue') },
      { path: 'support', component: () => import('pages/SupportPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
