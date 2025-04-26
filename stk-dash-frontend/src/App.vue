<script setup></script>

<template>
  <div class="app-container">
    <nav></nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
html.dark,
html.dark body {
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  color: var(--color-text);
  transition:
    background-color 0.3s,
    color 0.3s;
}

nav {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--color-text);
}

nav a.router-link-exact-active {
  color: var(--color-heading);
  font-weight: bold;
}

main {
  flex: 1;
  padding: 1rem;
  overflow: auto;
}
</style>
