<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { SearchDoc } from '../types/open-library';
import { coverUrl } from '../services/openLibrary';
import { useSavedBooks } from '../stores/saved';

const props = defineProps<{ book: SearchDoc }>();
const broken = ref(false);
const { ids, toggle } = useSavedBooks();
const saved = computed(() => ids.value.has(props.book.key));
const detailId = computed(() => props.book.key.replace('/works/',''));
</script>

<template>
  <article class="book-card">
    <RouterLink class="cover-wrap" :to="`/book/${detailId}`">
      <img v-if="book.cover_i && !broken" :src="coverUrl(book.cover_i,'M')" :alt="`Cover of ${book.title}`" loading="lazy" @error="broken = true" />
      <div v-else class="cover-fallback"><span>NO COVER</span><strong>{{ book.title.slice(0,1) }}</strong></div>
    </RouterLink>
    <div class="book-meta">
      <div class="book-kicker">{{ book.first_publish_year || 'Undated' }} · {{ book.edition_count || 1 }} editions</div>
      <RouterLink class="book-title" :to="`/book/${detailId}`">{{ book.title }}</RouterLink>
      <p>{{ book.author_name?.slice(0,2).join(', ') || 'Unknown author' }}</p>
      <div class="card-foot">
        <span v-if="book.ratings_average">★ {{ book.ratings_average.toFixed(1) }}</span><span v-else>No rating</span>
        <button type="button" @click="toggle(book)" :aria-pressed="saved">{{ saved ? 'Saved' : 'Save' }}</button>
      </div>
    </div>
  </article>
</template>
