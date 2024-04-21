<template>
  <div class="header-box" :class="{ 'is-homepage': isHomePage }">
    <div class="zoomInUp">
      <ul class="navbar-nav">
        <li>
          <a href="/home" class="nav-link box">Home</a>
        </li>
        <li v-if="hasRole('CLIENT')">
          <a href="/client/new" class="nav-link box">Add Client</a>
        </li> 
        <li v-if="hasRole('DOCTOR')">
          <a href="/doctor/new" class="nav-link box">Add Doctor</a>
        </li>
        <li v-if="hasRole('CLIENT')">
          <a href="/client/list" class="nav-link box">Show Clients</a>
        </li>
        <li v-if="hasRole('DOCTOR')">
          <a href="/pending/show" class="nav-link box">Show Pending</a>
        </li>
        <li v-if="hasRole('ADMIN')">
          <a href="/users" class="nav-link box">Users</a>
        </li>
        <li v-if="isAuthenticated">
          <a href="#" @click.prevent="handleLogout" class="nav-link box">Log Out</a>
        </li>
        <li v-if="!isAuthenticated">
          <a href="/login" class="nav-link box">Login</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';

const { isAuthenticated, loadUserData, logout } = useApplicationStore();
const userData = loadUserData();
const router = useRouter();
const isHomePage = ref(false);

const handleLogout = () => {
  logout();
};

const hasRole = (role) => {
  return isAuthenticated && userData.roles[0].includes(role);
};

router.beforeEach((to, from, next) => {
  isHomePage.value = to.name === 'home'; // Check for styling if it's home page
  next();
});
</script>

<style scoped>
.header-box {
  position: sticky;
  top: 0; 
  z-index: 100; 
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem;
  background-color: transparent; 
  border-radius: 8px;
  transition: margin-top 0.5s ease;
}

.navbar-nav {
  display: flex;
  gap: 1rem;
  list-style: none;
}

.nav-link {
  color: #fff; 
  text-decoration: none;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #4c5155;
}

.box {
  background-color: #202933; 
}

.zoomInUp {
  animation: zoomInUp 1s ease forwards;
}

@keyframes zoomInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(calc(50px + var(--translation, 0)));
  }
}

.is-homepage .zoomInUp {
  --translation: -20px;
}
</style>
