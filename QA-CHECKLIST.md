# INDEX — QA Checklist

## Build
- [ ] npm install
- [ ] vue-tsc strict type check
- [ ] Vite production build
- [ ] Browser console clean

## API behavior
- [ ] Search returns real Open Library results
- [ ] Query / language / sort / page survive in URL
- [ ] Browser back/forward restores search state
- [ ] Pagination works across multiple pages
- [ ] Detail route loads work + author data
- [ ] Missing cover fallback works
- [ ] Empty results state works
- [ ] Network error + retry state works
- [ ] Request cancellation avoids stale result races

## Product behavior
- [ ] Save / unsave persists in localStorage
- [ ] Saved page reflects current collection
- [ ] Direct deep-link to book route works
- [ ] 404 route resolves safely

## Responsive / visual
- [ ] 1440px desktop
- [ ] 1024px tablet
- [ ] 768px tablet
- [ ] 390px mobile
- [ ] No global horizontal overflow
- [ ] Cover crops remain visually acceptable
- [ ] Typography hierarchy remains editorial, not template-like

## Accessibility
- [ ] Keyboard navigation
- [ ] Focus visibility
- [ ] Form labels
- [ ] aria-live result count
- [ ] aria-busy skeleton state
- [ ] Reduced motion

## Release
- [ ] README final
- [ ] Case study
- [ ] GitHub source verified
- [ ] Live URL verified
