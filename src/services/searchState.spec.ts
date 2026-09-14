import { describe, expect, it } from 'vitest';
import { normalizeSearchState, serializeSearchState } from './searchState';

describe('searchState', () => {
  it('uses safe defaults for an empty query', () => {
    expect(normalizeSearchState({})).toEqual({ q: 'design', lang: '', sort: 'relevance', page: 1 });
  });

  it('rejects invalid page, language and sort values', () => {
    expect(normalizeSearchState({ q: '  architecture ', page: 'abc', lang: 'xx', sort: 'popular' })).toEqual({
      q: 'architecture', lang: '', sort: 'relevance', page: 1
    });
  });

  it('accepts supported values and positive integer pages', () => {
    expect(normalizeSearchState({ q: 'design', page: '3', lang: 'ara', sort: 'new' })).toEqual({
      q: 'design', lang: 'ara', sort: 'new', page: 3
    });
  });

  it('serializes default values without noisy URL parameters', () => {
    expect(serializeSearchState({ q: 'design', lang: '', sort: 'relevance', page: 1 })).toEqual({
      q: 'design', lang: undefined, sort: undefined, page: undefined
    });
  });
});
