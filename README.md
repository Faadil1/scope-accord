# Day 14 Claude Technical Spike

This is a clean implementation of the SAFE — The Structural Grid spike, implementing two states of the visual contract:

- **Different Understandings**: Proposal side-by-side with agreement, separated by a 2px boundary
- **Shared Understanding**: Proposal integrated into agreement structure

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`. A developer-only toggle (labeled "DEMO CONTROL — NOT PRODUCT UI") allows switching between states and content-ratio fixtures (1:1, 1:3, 3:1).

## Production Build

```bash
npm run build
```

Artifacts will be created in `dist/`.

## Tests

```bash
npm test
```

This runs all Playwright tests and generates screenshots in `artifacts/` directory. Tests measure:

- DOM structure and nesting
- Boundary presence and height spanning
- Understanding column visibility and order
- State transitions
- Responsive layout at multiple viewports
- Motion and accessibility contracts

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- Playwright (testing)
- Plain CSS Grid

No libraries beyond the core stack. No Tailwind, Framer Motion, GSAP, or component libraries.

## Key Features Implemented

✅ Two-state interface (different_understandings, shared_understanding)
✅ 12-column CSS Grid with 58/42 ratio on desktop
✅ 2px boundaries and dividers as specified
✅ Complete color and typography tokens
✅ Reduced-motion support (0ms transitions)
✅ Accessibility: semantic HTML, aria-live regions, 44px touch targets
✅ Three content fixtures: 1:1, 1:3, 3:1 ratio support
✅ Responsive: desktop (1440px), tablet (1024px), mobile (390px)
✅ Developer-only control panel (not in product markup)
✅ Playwright tests with real DOM measurements
✅ Screenshot generation at all viewports

## Specification

See `day14-visual-contract-safe.md` for the complete visual contract that governs this implementation.
