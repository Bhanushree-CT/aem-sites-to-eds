# Hero Product Block Development Plan

## Summary

Create a new `blocks/hero-product/` EDS block that renders a full-width dark hero banner with a background image, heading, description, and CTA button. Based on the design reference, this is a dark-themed product showcase hero with white text content on the left and a product image as the background.

## Content Model (DA.live Authoring)

Standard EDS hero pattern: **Row 1 = background image**, **Row 2 = text content (heading + description + CTA)**.

The EDS framework delivers this as:
```
.hero-product
  > div (row 1 - image)
    > div (cell)
      > picture > img
  > div (row 2 - content)
    > div (cell)
      > h1
      > p (description)
      > p > strong > a (CTA - primary button)
```

## Visual Design (from reference)

- **Background:** Solid dark (`#0a0a0a`)
- **Image:** Positioned to right side, covers full block area via `object-position: right center`
- **Heading:** Large bold white, ~48px mobile / ~64px desktop, sentence case (no uppercase)
- **Description:** Light grey/white text, 16-18px
- **CTA:** Dark pill button (`#1a1a1a`) with white text, subtle border, arrow icon (→)
- **Responsive:** Full-width, content left-aligned, min-height ~500-600px

## Proposed Implementation

### `hero-product.js`

```js
export default function decorate(block) {
  const rows = [...block.children];
  if (rows[0]) rows[0].classList.add('hero-product-image');
  if (rows[1]) rows[1].classList.add('hero-product-content');
}
```

### `hero-product.css`

- Full-width dark wrapper override
- Background image absolutely positioned with `object-fit: cover`, `object-position: right center`
- Content overlay with `z-index` stacking, max-width ~520px
- Heading: 48px/64px, white, `font-weight: 800`, `text-transform: none`
- Description: 16px/18px, white at 70% opacity
- CTA: dark pill with white text, `border-radius: 9999px`, arrow `::after` pseudo-element
- Hover: slightly lighter background + stronger border
- Mobile-first, breakpoint at `900px`

## DA.live Authoring Table (Sample Content)

| Hero Product |
|---|
| ![Premium wireless headphones](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80) |
| **Experience Media Like Never Before** <br> Enjoy award-winning stereo beats with wireless listening freedom and sleek, streamlined with premium padded and delivering first-rate playback. <br> **[Our Products](/products)** |

**How to author in DA.live:**
- Row 1: Insert an image (the background/product photo)
- Row 2: Type heading as Heading 1, add description paragraph below, then add a link wrapped in bold for the primary CTA button

## Files to Create

| File | Action |
|------|--------|
| `blocks/hero-product/hero-product.js` | Create new |
| `blocks/hero-product/hero-product.css` | Create new |

## Checklist

- [ ] Create directory `blocks/hero-product/`
- [ ] Write `blocks/hero-product/hero-product.js` with row class decoration
- [ ] Write `blocks/hero-product/hero-product.css` with dark theme, full-width layout, responsive typography, CTA styling
- [ ] Run ESLint on `hero-product.js` — verify no errors
- [ ] Run Stylelint on `hero-product.css` — verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Output the DA.live authoring table with sample content

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
