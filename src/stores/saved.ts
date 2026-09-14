import { computed, ref } from 'vue';
import type { SearchDoc } from '../types/open-library';

const KEY = 'index-saved-books';
const items = ref<SearchDoc[]>(read());

function read(): SearchDoc[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function persist() { localStorage.setItem(KEY, JSON.stringify(items.value)); }

export function useSavedBooks() {
  const ids = computed(() => new Set(items.value.map(item => item.key)));
  function toggle(book: SearchDoc) {
    const index = items.value.findIndex(item => item.key === book.key);
    if (index >= 0) items.value.splice(index, 1); else items.value.unshift(book);
    persist();
  }
  return { items, ids, toggle };
}
