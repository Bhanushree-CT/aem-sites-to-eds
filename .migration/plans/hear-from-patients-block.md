# Hear From Patients Block — Content-Driven Development Plan

## Summary

Create a new `blocks/hear-from-patients/` block that renders a horizontally scrollable testimonial slider with quote text (wrapped in typographic quotation marks), author metadata, and a patient image in a rounded-corner frame. Includes a progress bar indicator at the bottom. Based on the Figma NovoCare Design Library.

## Figma Design Analysis

**Source:** `https://www.figma.com/design/V0Fz97pKnNre06yfzCCHes/...?node-id=16763-12836`

**Component Structure:**
- **Frame** (1312×791): Main container with light grey background (`#f5f5f5`)
  - **Frame 1428** (1199×663): Slide content area
    - Header section: H2 "Hear from patients" (32px/40px bold) + subtitle paragraph (14px/18px, `#3f3f46`)
    - Slide layout: Two-column — left (quote + author) / right (image)
      - Quote icon: 100×100px decorative element
      - Quote text: 36px/44px medium, letter-spacing -1px, `#09090b`, wrapped in `"` `"`
      - Author name: 18px/26px medium, `#09090b`
      - Author meta: 14px/18px regular, `#52525b`
      - Image: 559×447px, `border-radius: 16px`, overflow hidden
  - **Frame 1429** (277×4): Progress bar indicator (horizontal track with active segment)

**Design Tokens:**
- Font: Noto Sans
- Container padding: 50px top/bottom
- Header-to-slide gap: 40px
- Quote-to-author gap: 40px
- Author name-to-meta gap: 4px (within), 8px between name block and meta
- Image: 559px wide, 447px tall, border-radius 16px
- Progress bar: 4px height, rounded segments, active segment wider/darker
- Left content width: ~435px (36% of 1199px)
- Right image width: ~559px (47% of 1199px)
- Column gap: ~205px (remaining space)

## Reference Block Search Results

- **Carousel** (Block Collection): Found — provides scroll-snap slider with IntersectionObserver active tracking, dot indicators, prev/next buttons. Adapted for this block with:
  - Removed `fetchPlaceholders` (not available in project)
  - Removed `moveInstrumentation` (not available in project)
  - Replaced dot indicators with progress bar track
  - Two-column slide layout (text left, image right)
  - Quote wrapping with typographic characters

## Content Model Design

### Block Type
**Collection** — Each row represents one testimonial slide.

### Authored Table Structure (DA.live)

The H2 "Hear from patients" and subtitle paragraph are authored as **default content above the block table**.

| Hear From Patients |
|--------------------|
| Lorem ipsum dolor sit amet, consectetur adipiscing elit... | Jane Done · Been with NovoCare for 2 years | ![Patient photo](/media/patient-jane.jpg) |
| Another testimonial quote text here... | John Smith · Been with NovoCare for 1 year | ![Patient photo](/media/patient-john.jpg) |
| Third testimonial quote text... | Sarah Lee · Been with NovoCare for 3 years | ![Patient photo](/media/patient-sarah.jpg) |

### Column Structure (3-column per row, Postel's Law)

| Column | Content | Decoration |
|--------|---------|------------|
| Col 1 | Quote text (plain paragraph) | JS wraps in `"` `"` typographic quotes, renders as blockquote |
| Col 2 | Author name + description (stacked paragraphs or `·`-separated) | JS splits into name (bold) and meta (secondary text) |
| Col 3 | Image (`<picture>`) | Optimized via `createOptimizedPicture`, rendered in rounded frame |

**Flexibility:**
- If Col 3 is missing → slide renders without image (text-only)
- If Col 2 has only one line → treated as name only, no meta
- If Col 1 already has quotes → don't double-wrap

## Proposed Implementation

### `hear-from-patients.js`

Key logic:
- Import `createOptimizedPicture` from `aem.js`
- Restructure table rows into `<ul>/<li>` slide track
- Per slide: Col 1 → `.hear-from-patients-quote` (wrap text in `"\u201C"` / `"\u201D"`), Col 2 → `.hear-from-patients-author` (split name + meta), Col 3 → `.hear-from-patients-image` (rounded frame)
- Build progress bar indicator (`<div>` track with segment per slide)
- IntersectionObserver tracks active slide and updates progress bar active segment
- Horizontal scroll-snap for smooth swipe behavior
- `createOptimizedPicture` for image optimization (width 750)

### `hear-from-patients.css`

Key properties:
- Container: `padding: 50px 0`, scoped under `.hear-from-patients`
- Slides track: `scroll-snap-type: x mandatory`, `overflow: scroll clip`, hidden scrollbar
- Each slide: `flex: 0 0 100%`, two-column grid (left ~40%, right ~50%, gap ~10%)
- Quote: 36px/44px medium, letter-spacing -1px, `#09090b`, left-aligned
- Author name: 18px/26px medium, `#09090b`
- Author meta: 14px/18px regular, `#52525b`
- Image frame: `border-radius: 16px`, `overflow: hidden`, `object-fit: cover`
- Progress bar: flexbox row, 4px height, segments with `border-radius: 2px`, active segment `background: #09090b` + wider width, inactive `background: #d4d4d8`
- Responsive: stacks vertically below 768px, quote font scales down to 28px

### `_hear-from-patients.json` (Universal Editor Schema)

Repeatable slide group with fields:
- `quote` (richtext) — Testimonial quote text
- `authorName` (text) — Patient name
- `authorMeta` (text) — Description/duration
- `image` (reference) — Patient photo

## Files to Create

| File | Action |
|------|--------|
| `blocks/hear-from-patients/hear-from-patients.js` | Create new |
| `blocks/hear-from-patients/hear-from-patients.css` | Create new |
| `blocks/hear-from-patients/_hear-from-patients.json` | Create new |

## Checklist

- [ ] Create directory `blocks/hear-from-patients/`
- [ ] Write `hear-from-patients.js` — Slide track restructuring, quote wrapping, author splitting, progress bar, IntersectionObserver, `createOptimizedPicture`
- [ ] Write `hear-from-patients.css` — 50px padding, scroll-snap, two-column slide layout, quote typography, rounded image frame, progress bar indicator, responsive stacking
- [ ] Create `_hear-from-patients.json` — Universal Editor schema with repeatable slide fields
- [ ] Run ESLint on `hear-from-patients.js` — verify no errors
- [ ] Run Stylelint on `hear-from-patients.css` — verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Generate authored plain HTML content for index page

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
