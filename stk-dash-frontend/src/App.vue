<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav></nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}

nav {
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
}

nav a.router-link-exact-active {
  color: #000;
  font-weight: bold;
}

main {
  flex: 1;
  padding: 1rem;
}
</style>
