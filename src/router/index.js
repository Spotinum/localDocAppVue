import { createRouter, createWebHistory } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/client/new',
      name: 'client-new',
      component: () => import('../views/AddClientView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/doctor/new',
      name: 'add-doctor',
      component: () => import('../views/AddDoctorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/client/list',
      name: 'client-list',
      component: () => import('../views/ClientListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/client/list/neardoctors',
      name: 'near-doctors',
      component: () => import('../views/ShowNearDoctorsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/family/list',
      name: 'family-list',
      component: () => import('../views/FamilyListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pending/show',
      name: 'pending-doctor',
      component: () => import('../views/PendingDoctorClientView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: `/pending/show/results`,
      name: 'pending-doctor-client',
      component: () => import('../views/PendingDoctorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegistrationView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const { loadUserData,isAuthenticated } = useApplicationStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  console.log('Route:', to.path);
  console.log('Requires Auth:', requiresAuth);
  console.log('Is Authenticated:', isAuthenticated);

  if (requiresAuth && !isAuthenticated) {
    console.log('User not authenticated. Redirecting to /login');
    next('/login');
  } else {
    console.log('User authenticated or route does not require auth. Proceeding.');
    next();
    loadUserData();
  }
});

export default router;