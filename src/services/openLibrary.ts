import type { AuthorResponse, SearchResponse, WorkResponse } from '../types/open-library';

const API = 'https://openlibrary.org';
const FIELDS = ['key','title','author_name','author_key','first_publish_year','edition_count','cover_i','language','subject','ratings_average','ratings_count'].join(',');

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'new' | 'old';
  language?: string;
  signal?: AbortSignal;
}

export async function searchBooks(params: SearchParams): Promise<SearchResponse> {
  const query = new URLSearchParams({
    q: params.language ? `${params.q} language:${params.language}` : params.q,
    fields: FIELDS,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 18)
  });
  if (params.sort && params.sort !== 'relevance') query.set('sort', params.sort);
  const response = await fetch(`${API}/search.json?${query}`, { signal: params.signal });
  if (!response.ok) throw new Error(`Search failed (${response.status})`);
  return response.json();
}

export async function getWork(workKey: string, signal?: AbortSignal): Promise<WorkResponse> {
  const response = await fetch(`${API}${workKey}.json`, { signal });
  if (!response.ok) throw new Error(`Work failed (${response.status})`);
  return response.json();
}

export async function getAuthor(authorKey: string, signal?: AbortSignal): Promise<AuthorResponse> {
  const response = await fetch(`${API}/authors/${authorKey}.json`, { signal });
  if (!response.ok) throw new Error(`Author failed (${response.status})`);
  return response.json();
}

export function coverUrl(coverId?: number, size: 'S'|'M'|'L'='M') {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false` : '';
}
