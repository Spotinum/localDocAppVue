<script setup>
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const { loadUserData } = useApplicationStore();

onBeforeMount(() => {
  loadUserData();
});

</script>

<template>
  <div id="app">
    <AppHeader  />
    <RouterView />
    <AppFooter />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  transition: background-color 0.5s ease;
}

body {
  font-family: 'Roboto', 'Helvetica', sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000000; 
}

header {
  background-color: #38444b; 
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.5s ease;
}

nav {
  background-color: #34495e; 
  color: #ecf0f1;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  width: 100%;
  transition: background-color 0.5s ease;
}

nav a {
  text-decoration: none;
  color: #ecf0f1;
  font-weight: bold;
  transition: color 0.3s;
}

nav a:hover {
  color: #3498db;
}

main {
  width: 80%;
  margin: 2rem 0;
}

footer {
  background-color: #3498db;
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.5s ease;
}
</style>
  