# Hero Carousel Block Development Plan

## Summary

Create a new `blocks/hero-carousel/` EDS block that renders a full-width image carousel with slide navigation. Each slide contains an image (column 1) and content (column 2: heading, description, CTA). Based on the Block Collection's carousel pattern, adapted for this project with scroll-snap transitions.

## Content Model (DA.live Authoring)

Each row = one slide. Column 1 = image, Column 2 = content (h3 + paragraph + CTA link).

**Delivered DOM structure:**
```
.hero-carousel
  > div (row/slide 1)
    > div (col 1 - image)
      > picture > img
    > div (col 2 - content)
      > h3
      > p
      > p > strong > a (CTA)
  > div (row/slide 2)
    ...
```

**Postel's Law flexibility:** The JS will handle missing columns gracefully — a slide with only an image (no content) or only content (no image) will still render correctly.

## Reference Block

The Block Collection carousel at `https://main--sta-boilerplate--aemdemos.aem.page/blocks/carousel/` provides the base pattern. Key adaptations needed for this project:

1. **Remove `fetchPlaceholders`** — not exported by this project's `aem.js`
2. **Remove `moveInstrumentation`** — not exported by this project's `scripts.js`
3. **Replace class names** — `carousel` → `hero-carousel` throughout JS
4. **Use hardcoded ARIA labels** — instead of fetched placeholders

## Proposed Implementation

### `hero-carousel.js`

Adapted from Block Collection carousel with:
- Removed `fetchPlaceholders` import (not available)
- Removed `moveInstrumentation` import (not available)
- All class names use `hero-carousel` prefix
- Hardcoded ARIA labels for accessibility
- Slide structure: image column + content column per slide
- Navigation: prev/next buttons + dot indicators
- IntersectionObserver for active slide tracking
- Scroll-snap based transitions (smooth, performant)

### `hero-carousel.css`

From the Block Collection with `hero-carousel` class prefix (already transformed). Provides:
- Scroll-snap horizontal scrolling
- Full-width slides with min-height
- Absolute-positioned background images
- Content overlay with semi-transparent background
- Navigation arrows (CSS-only chevrons via `::after`)
- Dot indicators with active/hover states
- Responsive content width at 600px breakpoint

## Files to Create

| File | Action |
|------|--------|
| `blocks/hero-carousel/hero-carousel.js` | Create new (adapted from Block Collection) |
| `blocks/hero-carousel/hero-carousel.css` | Create new (from Block Collection with class rename) |

## DA.live Authoring Table (Sample Content)

| Hero Carousel |
|---|
| ![Mountain landscape](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80) | **Explore the Outdoors** <br> Discover breathtaking trails and panoramic views that inspire your next adventure. <br> **[Start Exploring](/adventures)** |
| ![Ocean sunset](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80) | **Coastal Escapes** <br> Unwind at pristine beaches with crystal-clear waters and golden sunsets. <br> **[View Destinations](/destinations)** |
| ![City skyline](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80) | **Urban Adventures** <br> Experience vibrant city life with world-class dining, culture, and nightlife. <br> **[Plan Your Trip](/cities)** |

## Checklist

- [ ] Create directory `blocks/hero-carousel/`
- [ ] Write `blocks/hero-carousel/hero-carousel.js` — adapted carousel with removed unavailable imports, hero-carousel class names, hardcoded ARIA labels
- [ ] Write `blocks/hero-carousel/hero-carousel.css` — scroll-snap transitions, responsive layout, navigation controls
- [ ] Run ESLint on `hero-carousel.js` — verify no errors
- [ ] Run Stylelint on `hero-carousel.css` — verify no errors
- [ ] Verify JS syntax with `node --check`

## Key Design Decisions

- **No `fetchPlaceholders`** — this project's `aem.js` doesn't export it; use hardcoded English strings
- **No `moveInstrumentation`** — this project's `scripts.js` doesn't export it; skip instrumentation calls
- **Scroll-snap transitions** — hardware-accelerated, no JS animation loop needed
- **IntersectionObserver** — lightweight active slide detection without scroll event handlers
- **Postel's Law** — `createSlide` handles rows with 1 or 2 columns; missing image/content columns get empty wrappers with appropriate classes

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
