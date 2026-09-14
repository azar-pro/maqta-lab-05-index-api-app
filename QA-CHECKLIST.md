# INDEX — QA Checklist

Verified against the current Vue production build through GitHub Actions, Vitest, Puppeteer browser QA, and the live Vercel deployment.

## Build
- [x] `npm install` completes
- [x] Dependency audit reports 0 vulnerabilities
- [x] `vue-tsc --noEmit` passes
- [x] Vite production build passes
- [x] Verified production bundle uploaded as CI artifact
- [x] Browser console reports 0 errors
- [x] Browser page errors: 0
- [x] Browser request failures in deterministic QA: 0

## Unit coverage
- [x] 7/7 Vitest tests passing
- [x] Search state defaults
- [x] Invalid page / language / sort normalization
- [x] Supported state serialization
- [x] Open Library search URL construction
- [x] Work HTTP failure behavior
- [x] Author endpoint construction

## API behavior
- [x] Open Library live smoke request passes on latest release run
- [x] Production code uses real Open Library endpoints
- [x] Browser QA validates Open Library-shaped response contracts deterministically
- [x] Search query is written to URL
- [x] Language filter is written to URL
- [x] Invalid `page` values fall back safely to page 1
- [x] Invalid `sort` values fall back to relevance
- [x] Invalid `lang` values fall back to any language
- [x] AbortController cancels previous catalogue requests
- [x] Older aborted requests cannot incorrectly clear a newer loading state
- [x] Work detail reloads when `/book/:id` changes
- [x] Author failure is isolated from a successfully loaded work
- [x] Missing cover fallback exists
- [x] Empty results state exists
- [x] Network error + retry state exists

## Product behavior
- [x] Save persists to localStorage in browser QA
- [x] Saved page renders current collection
- [x] Vue catch-all route redirects unknown in-app routes to `/`
- [x] Public deep-link to `/book/:id` verified on Vercel without a 404

## Responsive / visual
- [x] 1440px desktop browser QA
- [x] 390px mobile browser QA
- [x] No global horizontal overflow at tested desktop/mobile widths
- [x] Small result sets no longer create a large empty grid-background block
- [x] Mobile page indicator stays on one line at 390px
- [x] Typography remains editorial and distinct from a generic SaaS template
- [ ] Optional 1024px / 768px dedicated screenshot pass

## Accessibility / interaction
- [x] Search control uses a visible label
- [x] Filter controls use visible labels
- [x] Result count uses `aria-live="polite"`
- [x] Loading grid uses `aria-busy="true"`
- [x] Pagination has an accessible nav label
- [x] Reduced-motion preference disables animation
- [ ] Full keyboard-only walkthrough
- [ ] Formal screen-reader audit

## Production metrics
- [x] HTML: **0.58 kB**
- [x] CSS: **7.18 kB raw / 2.16 kB gzip**
- [x] JavaScript: **100.57 kB raw / 38.76 kB gzip**
- [x] 36 modules transformed
- [x] Browser automated checks: **10/10 passing**
- [x] Unit tests: **7/7 passing**

## Release artifacts
- [x] README updated with verified facts
- [x] Browser screenshots captured for Discover desktop, Saved, Work detail and Discover mobile
- [x] GitHub source verified
- [x] CI production artifact preserved
- [x] Portfolio case study prepared
- [x] Public Vercel URL independently verified
- [x] Public deep-link tested successfully

## Release status

**PROJECT 05 — INDEX: COMPLETE.**

Production URL: https://index-book-discovery-meryf2026-1383.vercel.app
