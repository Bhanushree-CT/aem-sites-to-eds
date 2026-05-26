# Feature Cards Block — Content-Driven Development Plan

## Summary

Rewrite the existing `blocks/feature-cards/` block to follow the official Block Collection's `cards` pattern (list-based DOM restructuring) while matching the design mockup: a 3-column responsive grid of centered feature cards, each with an icon, heading, description, and "Learn more" CTA link. Also add a `_feature-cards.json` Universal Editor schema.

## Reference Block Analysis

The Block Collection `cards` block uses this pattern:
- Restructures authored rows into `<ul>/<li>` list items
- Each `<li>` gets children classified as `cards-card-image` (if it contains only a `<picture>`) or `cards-card-body` (everything else)
- Uses `createOptimizedPicture` for image optimization
- Uses `moveInstrumentation` for UE instrumentation tracking

**Adaptations needed for this project:**
- `moveInstrumentation` is NOT available in this project's `scripts.js` — must be removed
- `createOptimizedPicture` IS available in `aem.js` — can be kept
- Class names use `feature-cards-card-*` prefix
- CSS redesigned to match the mockup (centered cards, rounded corners, hover effects)

## Content Model (2-cell pattern per row)

Each authored row = one feature card:
- **Cell 1:** Icon image (`<picture>`)
- **Cell 2:** H3 heading + description paragraph + CTA link (`<a>`)

**Postel's Law flexibility:**
- If Cell 1 is missing (no icon) → card renders without icon area
- If Cell 2 has only text (no heading structure) → text wraps as body content
- If all content is in a single cell → classify as body, skip image detection

## Visual Design (from mockup)

- **Grid:** 3 columns desktop, 2 tablet, 1 mobile
- **Cards:** White background, light grey border (`#e8e8e8`), `border-radius: 16px`, centered text
- **Icon:** 80px container, centered above text
- **Heading:** Bold ~20px, dark text
- **Description:** Regular weight, grey text, centered
- **CTA:** Blue link text ("Learn more →"), no underline until hover
- **Hover:** Card lifts (`translateY(-4px)`) with subtle shadow
- **Section heading** (eyebrow + h2 + subtitle) is authored as default content above the block

## Proposed Implementation

### `feature-cards.js` (rewrite using Block Collection pattern)

```js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'feature-cards-card-image';
      } else {
        div.className = 'feature-cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
```

**Key decisions:**
- Follows Block Collection cards pattern (DOM to `<ul>/<li>`)
- Removed `moveInstrumentation` (not available)
- Kept `createOptimizedPicture` (available in aem.js, optimizes icons)
- Small image width (`200`) since these are icons, not hero images
- Postel's Law: classifies children by detecting `<picture>` presence vs body content

### `feature-cards.css` (rewrite for mockup design)

Key properties:
- Grid with `repeat(auto-fill, minmax(280px, 1fr))` for fluid 3→2→1 columns
- Cards: `border-radius: 16px`, `border: 1px solid #e8e8e8`, `text-align: center`, `padding: 48px 32px`
- Hover: `translateY(-4px)` + `box-shadow`
- Icon image: `width: 80px`, `height: 80px`, `object-fit: contain`, centered
- CTA link: inline-flex with `::after` arrow, blue color

### `_feature-cards.json` (Universal Editor schema)

Repeatable item group with fields:
- `image` (reference) — icon image
- `heading` (text) — card title
- `description` (richtext) — card description
- `ctaText` (text) — link label
- `ctaLink` (text) — link URL

## Files to Modify/Create

| File | Action |
|------|--------|
| `blocks/feature-cards/feature-cards.js` | Rewrite (Block Collection pattern) |
| `blocks/feature-cards/feature-cards.css` | Rewrite (match mockup design) |
| `blocks/feature-cards/_feature-cards.json` | Create new (UE schema) |

## Checklist

- [ ] Rewrite `blocks/feature-cards/feature-cards.js` using Block Collection cards DOM restructuring pattern with Postel's Law flexibility
- [ ] Rewrite `blocks/feature-cards/feature-cards.css` with responsive grid, centered cards, rounded corners, hover effects, CTA arrow
- [ ] Create `blocks/feature-cards/_feature-cards.json` Universal Editor schema with repeatable item fields
- [ ] Run ESLint on `feature-cards.js` — verify no errors
- [ ] Run Stylelint on `feature-cards.css` — verify no errors
- [ ] Verify JS syntax with `node --check`

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file changes.
