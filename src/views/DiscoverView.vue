<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookCard from '../components/BookCard.vue';
import BookSkeleton from '../components/BookSkeleton.vue';
import { searchBooks } from '../services/openLibrary';
import { normalizeSearchState, serializeSearchState, type LanguageCode, type SortMode } from '../services/searchState';
import type { SearchDoc } from '../types/open-library';

const route = useRoute();
const router = useRouter();
const query = ref('design');
const language = ref<LanguageCode>('');
const sort = ref<SortMode>('relevance');
const page = ref(1);
const books = ref<SearchDoc[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref('');
let controller: AbortController | undefined;

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / 18)));
const resultLabel = computed(() => loading.value ? 'Searching the catalogue…' : `${total.value.toLocaleString()} works found`);

async function load() {
  controller?.abort();
  const current = new AbortController();
  controller = current;
  loading.value = true;
  error.value = '';
  try {
    const data = await searchBooks({
      q: query.value.trim() || 'design',
      page: page.value,
      limit: 18,
      sort: sort.value,
      language: language.value || undefined,
      signal: current.signal
    });
    if (current.signal.aborted) return;
    books.value = data.docs;
    total.value = data.numFound;

    const maxPage = Math.max(1, Math.ceil(data.numFound / 18));
    if (page.value > maxPage) {
      await router.replace({ query: serializeSearchState({ q: query.value, lang: language.value, sort: sort.value, page: maxPage }) });
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError' && !current.signal.aborted) {
      error.value = 'The catalogue could not be reached. Try again.';
    }
  } finally {
    if (controller === current) loading.value = false;
  }
}

function currentState(nextPage = page.value) {
  return { q: query.value.trim() || 'design', lang: language.value, sort: sort.value, page: nextPage };
}
function submit() { router.push({ query: serializeSearchState(currentState(1)) }); }
function changeFilters() { router.push({ query: serializeSearchState(currentState(1)) }); }
function go(next: number) {
  const target = Math.min(Math.max(next, 1), pageCount.value);
  router.push({ query: serializeSearchState(currentState(target)) });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

watch(() => route.query, () => {
  const normalized = normalizeSearchState(route.query as Record<string, unknown>);
  query.value = normalized.q;
  language.value = normalized.lang;
  sort.value = normalized.sort;
  page.value = normalized.page;
  load();
}, { deep: true, immediate: true });

onBeforeUnmount(() => controller?.abort());
</script>

<template>
  <main>
    <section class="hero">
      <div><div class="eyebrow">OPEN CATALOGUE / RESEARCH INTERFACE</div><h1>Find the book<br/>behind the idea.</h1></div>
      <p>Search millions of works, compare editions, follow authors and keep a focused reading list without losing your place.</p>
    </section>
    <section class="search-panel" aria-label="Search catalogue">
      <form @submit.prevent="submit" class="search-row">
        <label class="search-field"><span>Search</span><input v-model="query" placeholder="Title, author, subject…" /></label>
        <button class="primary" type="submit">Search catalogue</button>
      </form>
      <div class="filter-row">
        <label><span>Language</span><select v-model="language" @change="changeFilters"><option value="">Any language</option><option value="eng">English</option><option value="fre">French</option><option value="spa">Spanish</option><option value="ara">Arabic</option></select></label>
        <label><span>Sort</span><select v-model="sort" @change="changeFilters"><option value="relevance">Relevance</option><option value="new">Newest first</option><option value="old">Oldest first</option></select></label>
        <div class="result-count" aria-live="polite">{{ resultLabel }}</div>
      </div>
    </section>
    <section class="results-section">
      <div v-if="error" class="state-panel"><div><span>CATALOGUE ERROR</span><h2>Search interrupted.</h2><p>{{ error }}</p></div><button @click="load">Retry</button></div>
      <div v-else-if="loading" class="book-grid" aria-busy="true"><BookSkeleton v-for="n in 12" :key="n" /></div>
      <div v-else-if="books.length" class="book-grid"><BookCard v-for="book in books" :key="book.key" :book="book" /></div>
      <div v-else class="state-panel"><div><span>ZERO RESULTS</span><h2>No matching works.</h2><p>Try a broader title, author, or remove a language filter.</p></div></div>
      <nav v-if="!loading && books.length" class="pagination" aria-label="Search results pages"><button :disabled="page===1" @click="go(page-1)">← Previous</button><span>Page {{ page }} of {{ pageCount.toLocaleString() }}</span><button :disabled="page===pageCount" @click="go(page+1)">Next →</button></nav>
    </section>
  </main>
</template>
