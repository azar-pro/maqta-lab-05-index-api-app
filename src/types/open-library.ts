export interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  language?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
}

export interface SearchResponse {
  numFound: number;
  start: number;
  docs: SearchDoc[];
}

export interface WorkResponse {
  key: string;
  title: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  authors?: Array<{ author: { key: string } }>;
}

export interface AuthorResponse {
  name: string;
  bio?: string | { value: string };
  birth_date?: string;
  death_date?: string;
}
