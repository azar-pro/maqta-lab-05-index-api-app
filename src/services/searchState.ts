export type SortMode = 'relevance' | 'new' | 'old';
export type LanguageCode = '' | 'eng' | 'fre' | 'spa' | 'ara';

export interface SearchState {
  q: string;
  lang: LanguageCode;
  sort: SortMode;
  page: number;
}

const SORTS = new Set<SortMode>(['relevance', 'new', 'old']);
const LANGUAGES = new Set<LanguageCode>(['', 'eng', 'fre', 'spa', 'ara']);

function first(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '');
  return value == null ? '' : String(value);
}

export function normalizeSearchState(query: Record<string, unknown>): SearchState {
  const q = first(query.q).trim() || 'design';
  const rawLang = first(query.lang) as LanguageCode;
  const rawSort = first(query.sort) as SortMode;
  const rawPage = Number(first(query.page) || 1);

  return {
    q,
    lang: LANGUAGES.has(rawLang) ? rawLang : '',
    sort: SORTS.has(rawSort) ? rawSort : 'relevance',
    page: Number.isFinite(rawPage) && Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  };
}

export function serializeSearchState(state: SearchState, page = state.page) {
  return {
    q: state.q || undefined,
    lang: state.lang || undefined,
    sort: state.sort !== 'relevance' ? state.sort : undefined,
    page: page > 1 ? String(page) : undefined
  };
}
