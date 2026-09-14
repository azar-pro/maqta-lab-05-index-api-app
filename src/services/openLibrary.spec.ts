import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuthor, getWork, searchBooks } from './openLibrary';

afterEach(() => vi.unstubAllGlobals());

describe('Open Library service', () => {
  it('builds a search request with language, page and sort', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ numFound: 0, docs: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    await searchBooks({ q: 'architecture', language: 'eng', page: 2, limit: 18, sort: 'new' });

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain('/search.json?');
    expect(url).toContain('q=architecture+language%3Aeng');
    expect(url).toContain('page=2');
    expect(url).toContain('limit=18');
    expect(url).toContain('sort=new');
  });

  it('throws on failed work responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(getWork('/works/OL1W')).rejects.toThrow('Work failed (404)');
  });

  it('requests authors from the expected endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ name: 'Ada North' }) });
    vi.stubGlobal('fetch', fetchMock);

    await getAuthor('OL1A');
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://openlibrary.org/authors/OL1A.json');
  });
});
