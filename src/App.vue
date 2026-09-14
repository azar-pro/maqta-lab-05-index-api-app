<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useSavedBooks } from './stores/saved';
const route = useRoute();
const { items } = useSavedBooks();
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="INDEX home"><span class="brand-mark">IX</span><span>INDEX</span></RouterLink>
      <nav aria-label="Primary navigation">
        <RouterLink to="/" :class="{active: route.path === '/'}">Discover</RouterLink>
        <RouterLink to="/saved">Saved <span class="count">{{ items.length }}</span></RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    <RouterView />
    <footer><span>Catalogue data & covers via <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a></span><a href="https://maqtastudio.com" target="_blank" rel="noreferrer">Created by MAQTA STUDIO</a></footer>
  </div>
</template>
