# INDEX — Portfolio Case Study

## Overview

INDEX is an API-driven book discovery workspace built as MAQTA Lab Project 05. The goal was to demonstrate production-oriented API integration rather than another static catalogue or tutorial search app.

The product uses Open Library for catalogue search, work details, author data and cover images, while keeping the interface intentionally calm, editorial and research-focused.

## The problem

Many API demos prove only that data can be fetched. They often stop at a search field and a list of cards, leaving out the parts that make a client application feel reliable:

- state that survives refresh and back/forward navigation
- pagination and filtering
- incomplete third-party data
- loading, empty and error states
- stale requests when users search quickly
- deep detail routes
- persistent user choices
- responsive behavior
- release verification

INDEX was designed around those failure points from the beginning.

## Product direction

The interface follows an **editorial research library** direction rather than a generic SaaS dashboard:

- warm paper background
- dark ink typography
- oxide-red editorial accents
- large serif display type
- thin ruled dividers
- square geometry
- restrained controls and very little decorative UI

The goal is to make the catalogue feel closer to a serious reference publication than a template-driven media app.

## Information architecture

### Discover

The primary workspace combines:

- search
- language filter
- sort order
- result count
- paginated works
- save actions

Search state is represented in the URL so users can refresh, navigate backward/forward and share a meaningful catalogue state.

### Work detail

A work route fetches the Open Library work record and then enriches it with author information. Author data is deliberately treated as secondary: if the author request fails, the work remains usable rather than collapsing the entire detail page.

### Saved works

A lightweight local reading shortlist is persisted with `localStorage`. This gives the demo a real user workflow without pretending to have a backend account system.

## API architecture

The Open Library service layer owns endpoint construction and HTTP error handling. Components consume typed responses rather than constructing external URLs throughout the UI.

Key integration concerns handled:

- abortable search requests
- HTTP failure detection
- missing covers
- missing descriptions
- missing author metadata
- invalid URL state
- out-of-range pagination
- route parameter changes

## Reliability decisions

### Race-condition protection

Every catalogue load receives its own `AbortController`. Starting a new request aborts the previous one, and an older aborted request cannot incorrectly clear the loading state of the newer request.

### Defensive URL state

`page`, `sort` and `lang` query parameters are normalized before use. Invalid or malformed values safely fall back to supported defaults.

### Partial-data resilience

The work request and author request are intentionally separated. A failed author enrichment request displays a fallback author label while preserving the successfully loaded work.

## QA strategy

The production application uses the real Open Library API.

The CI browser suite uses deterministic fixtures that match Open Library response contracts. This prevents third-party network instability from randomly breaking the release pipeline while still exercising the actual product UI and routing behavior.

A separate live API smoke request checks real Open Library connectivity without making the full deterministic browser suite dependent on external uptime.

### Verified Sprint 02 release gates

- 7/7 Vitest unit tests passing
- TypeScript / Vue type check passing
- Vite production build passing
- Open Library live smoke request passing
- 10/10 Chrome browser checks passing
- desktop and 390px mobile overflow checks passing
- localStorage saved workflow passing
- work + author response contracts passing
- 0 console errors
- 0 page errors
- 0 deterministic-browser request failures

## Visual QA findings

The first browser screenshots exposed two issues that would not have been obvious from reading CSS alone:

1. The grid background continued across empty columns when fixture result sets were small, creating a large unfinished-looking block.
2. The mobile pagination label wrapped at 390px.

Both were corrected and re-tested through the same browser pipeline.

## Performance

Verified Sprint 02 production output:

- HTML: 0.58 kB
- CSS: 7.18 kB raw / 2.16 kB gzip
- JavaScript: 100.57 kB raw / 38.76 kB gzip
- 36 modules transformed

## What this project demonstrates

INDEX demonstrates more than the ability to call an API. It shows:

- Vue 3 + TypeScript product architecture
- third-party API integration
- URL-driven application state
- defensive data handling
- cancellation and race-condition management
- persistent client state
- responsive editorial UI
- deterministic browser testing
- CI release gates
- production artifact management

---

Created by [MAQTA STUDIO](https://maqtastudio.com)
