<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { coverUrl, getAuthor, getWork } from '../services/openLibrary';
import { useSavedBooks } from '../stores/saved';
import type { AuthorResponse, SearchDoc, WorkResponse } from '../types/open-library';

const route = useRoute();
const work = ref<WorkResponse | null>(null);
const author = ref<AuthorResponse | null>(null);
const loading = ref(true);
const error = ref('');
const broken = ref(false);
let controller: AbortController | undefined;

const { ids, toggle } = useSavedBooks();
const description = computed(() => {
  const d = work.value?.description;
  return typeof d === 'string' ? d : d?.value || 'No editorial description is available for this work.';
});
const savedBook = computed<SearchDoc | null>(() => {
  if (!work.value) return null;
  const year = work.value.first_publish_date?.match(/\d{4}/)?.[0];
  return {
    key: work.value.key,
    title: work.value.title,
    author_name: author.value?.name ? [author.value.name] : undefined,
    author_key: work.value.authors?.map(item => item.author.key.split('/').pop() || '').filter(Boolean),
    first_publish_year: year ? Number(year) : undefined,
    cover_i: work.value.covers?.[0],
    subject: work.value.subjects
  };
});
const saved = computed(() => Boolean(savedBook.value && ids.value.has(savedBook.value.key)));

function toggleSaved() {
  if (savedBook.value) toggle(savedBook.value);
}

async function load(id: string) {
  controller?.abort();
  const current = new AbortController();
  controller = current;
  loading.value = true;
  error.value = '';
  broken.value = false;
  work.value = null;
  author.value = null;

  try {
    const nextWork = await getWork(`/works/${id}`, current.signal);
    if (current.signal.aborted) return;
    work.value = nextWork;

    const authorKey = nextWork.authors?.[0]?.author.key?.split('/').pop();
    if (authorKey) {
      try {
        author.value = await getAuthor(authorKey, current.signal);
      } catch (authorError) {
        if ((authorError as Error).name === 'AbortError') return;
        author.value = null;
      }
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError' && !current.signal.aborted) {
      error.value = 'This work could not be loaded.';
    }
  } finally {
    if (controller === current) loading.value = false;
  }
}

watch(() => String(route.params.id || ''), id => {
  if (id) load(id);
}, { immediate: true });

onBeforeUnmount(() => controller?.abort());
</script>

<template>
  <main class="detail-page">
    <RouterLink class="back-link" to="/">← Back to discovery</RouterLink>
    <div v-if="loading" class="detail-loading"><div class="skeleton detail-cover"></div><div><div class="skeleton line"></div><div class="skeleton line short"></div></div></div>
    <div v-else-if="error" class="state-panel"><div><span>WORK ERROR</span><h2>{{ error }}</h2></div><button @click="load(String(route.params.id || ''))">Retry</button></div>
    <article v-else-if="work" class="book-detail">
      <div class="detail-cover-wrap">
        <img v-if="work.covers?.[0] && !broken" :src="coverUrl(work.covers[0],'L')" :alt="`Cover of ${work.title}`" @error="broken=true"/>
        <div v-else class="cover-fallback large"><span>NO COVER</span><strong>{{ work.title.slice(0,1) }}</strong></div>
      </div>
      <div class="detail-copy">
        <div class="eyebrow">WORK / {{ route.params.id }}</div>
        <h1>{{ work.title }}</h1>
        <div class="detail-actions">
          <button type="button" class="detail-save" :aria-pressed="saved" @click="toggleSaved">
            {{ saved ? 'Remove from saved' : 'Save to reading list' }}
          </button>
        </div>
        <div class="author-block">
          <span>Primary author</span>
          <strong>{{ author?.name || 'Author data unavailable' }}</strong>
          <small v-if="author?.birth_date">{{ author.birth_date }}<template v-if="author.death_date"> — {{ author.death_date }}</template></small>
        </div>
        <p class="description">{{ description }}</p>
        <div v-if="work.subjects?.length" class="subjects"><span v-for="subject in work.subjects.slice(0,10)" :key="subject">{{ subject }}</span></div>
      </div>
    </article>
  </main>
</template>
