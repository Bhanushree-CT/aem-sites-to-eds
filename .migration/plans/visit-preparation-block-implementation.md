# Visit Preparation Block — Content-Driven Development Plan

## Summary

Create a new `blocks/visit-preparation/` block that renders a 4-column card grid for patient visit preparation steps. Each card contains an icon, title, description, and an outline pill-style CTA button. Based on the Figma NovoCare Design Library.

## Figma Design Analysis

**Source:** `https://www.figma.com/design/V0Fz97pKnNre06yfzCCHes/...?node-id=16624-10635`

**Component Structure:**
- **Frame** (1314×526): Main container
  - **Frame 1418** (1234×92): Header section (H2 + subtitle) — lives outside block table
  - **Frame 1409** (1234×322): 4-column card grid with `gap: 10px`

**Design Tokens (from Figma extraction):**
- Font: Noto Sans
- Card background: `#e4e4e7` (tertiary background)
- Card border: `1px solid #e4e4e7`
- Card border-radius: `8px`
- Card padding: `24px`
- Card internal gap: `32px` (between icon and content), `8px` (between title/desc/button)
- Icon: 49×40px, `border-radius: 10px`
- Card title: 18px/26px medium, `#09090b`
- Card description: 14px/18px regular, `#52525b`
- Button: outline pill, `border-radius: 27px`, `border: 1.35px solid #52525b`, transparent background, 16px/22px medium text `#52525b`
- Grid gap: `10px` between cards
- Container padding: `40px` all sides
- Header-to-grid gap: `32px`

## Reference Block Search Results

- **Cards** (Block Collection): Found — provides `<ul>/<li>` restructuring, `createOptimizedPicture`, and card classification logic. Adapted for this block with:
  - Removed `moveInstrumentation` (not available in project)
  - Kept `createOptimizedPicture` for icon optimization
  - Added 4-column specific class and CTA button transformation
  - Outline pill button styling for action links

## Content Model Design

### Block Type
**Collection** — Each row represents one preparation card.

### Authored Table Structure (DA.live)

The H2 "Preparing for your first visit" and subtitle are **default content above the block table**.

| Visit Preparation |
|-------------------|
| ![icon](/media/savings-icon.png) | Find available savings | Depending on your treatment, you may be eligible for savings offers... | [See savings offers](/savings) |
| ![icon](/media/insurance-icon.png) | Check your insurance | Coverage varies by plan and by treatment... | [Check my coverage](/insurance) |
| ![icon](/media/guide-icon.png) | Prepare to talk to your healthcare provider | It can be hard to know where to start... | [Read the guide](/guide) |
| ![icon](/media/delivery-icon.png) | See if you're eligible for home delivery | Once prescribed, certain medications can be delivered... | [Learn about home delivery](/delivery) |

### Column Structure (4-column per row, Postel's Law)

| Column | Content | Decoration |
|--------|---------|------------|
| Col 1 | Icon image (`<picture>`) | Optimized via `createOptimizedPicture`, rendered at 49px |
| Col 2 | Card title (text string) | Rendered as bold heading text |
| Col 3 | Card description (paragraph) | Regular body text |
| Col 4 | CTA link (`<a>`) | Transformed into outline pill button |

**Flexibility:**
- If Col 1 is missing → card renders without icon
- If Col 4 is missing → card renders without button
- If fewer than 4 columns → classify remaining columns as body content
- If all content is in 2 columns (image + body) → falls back to standard cards pattern

## Proposed Implementation

### `visit-preparation.js`

Key logic:
- Import `createOptimizedPicture` from `aem.js`
- Restructure table rows into `<ul>/<li>` card grid
- Per card: Col 1 → `.visit-preparation-icon`, Col 2 → `.visit-preparation-title`, Col 3 → `.visit-preparation-description`, Col 4 → `.visit-preparation-cta`
- Transform Col 4 anchor link into `a.button.button-outline` class
- Optimize icon images via `createOptimizedPicture` (width 100)
- Postel's Law: gracefully handles missing columns

### `visit-preparation.css`

Key properties:
- Container: `padding: 40px`
- Grid: `grid-template-columns: repeat(4, 1fr)`, `gap: 10px`
- Cards: `background: #e4e4e7`, `border: 1px solid #e4e4e7`, `border-radius: 8px`, `padding: 24px`
- Card layout: flex column, `gap: 8px` between elements, content pushed to fill with button at bottom via `margin-top: auto`
- Icon: `width: 49px`, `height: 40px`, `border-radius: 10px`
- Title: 18px/26px medium, `#09090b`
- Description: 14px/18px regular, `#52525b`
- Button: `border: 1.35px solid #52525b`, `border-radius: 27px`, transparent bg, `padding: 10px`, `color: #52525b`, 16px/22px medium
- Responsive: 2 columns at tablet (768px), 1 column on mobile (<600px)

### `_visit-preparation.json` (Universal Editor Schema)

Repeatable card group with fields:
- `icon` (reference) — Card icon image
- `title` (text) — Card heading
- `description` (richtext) — Card body text
- `ctaText` (text) — Button label
- `ctaLink` (text) — Button destination URL

## Files to Create

| File | Action |
|------|--------|
| `blocks/visit-preparation/visit-preparation.js` | Create new |
| `blocks/visit-preparation/visit-preparation.css` | Create new |
| `blocks/visit-preparation/_visit-preparation.json` | Create new |

## Checklist

- [ ] Create directory `blocks/visit-preparation/`
- [ ] Write `visit-preparation.js` — Card grid restructuring with icon optimization, 4-column classification, outline button transformation, Postel's Law flexibility
- [ ] Write `visit-preparation.css` — 40px padding, 4-column grid, card styling with grey background, outline pill buttons, responsive breakpoints
- [ ] Create `_visit-preparation.json` — Universal Editor schema with repeatable card group
- [ ] Run ESLint on `visit-preparation.js` — verify no errors
- [ ] Run Stylelint on `visit-preparation.css` — verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Generate authored plain HTML content for index page

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
