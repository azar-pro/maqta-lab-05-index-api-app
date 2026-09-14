# INDEX — Book Discovery Workspace

![CI](https://github.com/azar-pro/maqta-lab-05-index-api-app/actions/workflows/ci.yml/badge.svg)

**MAQTA Lab Project 05 — COMPLETE** — a portfolio-grade API-driven discovery product built with Vue 3, TypeScript and the Open Library APIs.

**Live:** https://index-book-discovery-meryf2026-1383.vercel.app

INDEX treats book search as a calm research workspace rather than a generic card catalogue: users can search millions of works, preserve filters in the URL, inspect work/author data and keep a local reading shortlist.

> Fictional portfolio product. Catalogue data and covers are provided by Open Library.

## Product highlights

- Real Open Library Search API integration
- Work detail + Author API requests
- Cover service integration with missing-cover fallback
- URL-driven query, language, sort and pagination state
- Back/forward-compatible routing model
- Saved reading list persisted in `localStorage`
- Save / remove controls available from both result cards and the work-detail page
- Saved counter reacts immediately to detail-page changes
- Abortable requests to prevent stale-result races
- Loading, empty, error and retry UI states
- Defensive URL parsing for invalid `page`, `sort` and `lang` values
- Work detail reloads correctly when route params change
- Author-request failure does not collapse a successfully loaded work
- Responsive editorial interface for desktop and mobile
- Reduced-motion support and accessible live/loading states

## Stack

- Vue 3
- TypeScript 6.0.3
- Vite 8
- Vue Router
- Vitest
- Puppeteer + Chrome browser QA
- GitHub Actions
- Open Library Search / Works / Authors / Covers APIs

## Verified release status

Verified on GitHub Actions with Node **22.22.3** and confirmed on the live Vercel production deployment.

- ✅ Dependency install — **0 vulnerabilities**
- ✅ Unit tests — **7/7 passing**
- ✅ `vue-tsc --noEmit`
- ✅ Vite production build
- ✅ Open Library live smoke request
- ✅ Browser QA — **15/15 checks passing**
- ✅ Desktop 1440px — no global overflow
- ✅ Mobile 390px — no global overflow
- ✅ Search state written to URL
- ✅ Language filter written to URL
- ✅ Saved state persists to localStorage
- ✅ Saved collection renders
- ✅ Work detail contract renders
- ✅ Author data contract renders
- ✅ Detail page exposes current saved state
- ✅ Detail page can remove and re-save a work
- ✅ Header Saved counter reacts to detail-page save / remove actions
- ✅ Browser report — **0 console errors, 0 page errors, 0 request failures**
- ✅ Verified production `dist` preserved as a CI artifact and published to the `dist` branch
- ✅ Vercel production URL opened successfully
- ✅ Direct deep-link to `/book/:id` verified in production without a 404
- ✅ Real Open Library cover, work, author, description and subject data rendered on the live site

### Production bundle

Latest verified build:

- HTML: **0.58 kB raw / 0.38 kB gzip**
- CSS: **7.63 kB raw / 2.27 kB gzip**
- JavaScript: **101.23 kB raw / 38.96 kB gzip**
- Modules transformed: **36**

## QA architecture

The application uses the **real Open Library API in production**. Browser CI uses deterministic fixtures that match Open Library response contracts so external outages do not make the release pipeline flaky. A separate live smoke request verifies that the real external API is reachable when the runner network permits it.

This split keeps product behavior deterministic while still checking real API connectivity.

## Visual direction

INDEX uses an editorial research-library direction: warm paper, dark ink, restrained oxide-red accents, serif display typography and square ruled geometry. The layout intentionally avoids generic SaaS gradients and rounded-card patterns.

Sprint 02 visual QA removed an empty grid background that made small result sets look unfinished and tightened mobile pagination so the page indicator stays on one line at 390px.

## Run locally

```bash
npm install
npm run dev
```

## Verify locally

```bash
npm test
npm run build
```

See [`QA-CHECKLIST.md`](QA-CHECKLIST.md) for release gates and [`CASE-STUDY.md`](CASE-STUDY.md) for the portfolio case study.

---

Created by [MAQTA STUDIO](https://maqtastudio.com)
