# Hero Product Block Development Plan

## Summary

Create a new `blocks/hero-product/` EDS block that renders a full-width dark hero banner with a background image, heading, description, and CTA button. Based on the design reference, this is a dark-themed product showcase hero with white text overlaid on a dark background, featuring a prominent product image on the right side.

## Content Model (DA.live Authoring Structure)

The block uses the standard EDS hero pattern: **Row 1 = background image**, **Row 2 = text content**.

**Authored table in DA.live:**

| Hero Product |
|---|
| `[background-image.jpg]` |
| `<h1>Experience Media Like Never Before</h1><p>Enjoy award-winning stereo beats with wireless listening freedom...</p><p><a href="/products">Our Products</a></p>` |

**Row breakdown:**
1. **Row 1 (image row):** A single cell with a `<picture>` element — the background image
2. **Row 2 (content row):** A single cell with heading (`h1`), paragraph(s), and a CTA link (wrapped in `<strong>` for primary button decoration by EDS)

## Visual Design (from reference image)

- **Background:** Solid dark (`#0a0a0a`) with product image as visual element
- **Layout:** Two-column feel — text content left-aligned, product image on right (achieved via background positioning)
- **Heading:** Large bold white text, ~48px mobile / ~64px desktop, no uppercase
- **Description:** White/grey body text, ~16-18px
- **CTA button:** Dark background (#1a1a1a) with white text, rounded pill shape, arrow icon (→)
- **Responsive:** Full-width, stacks naturally on mobile with reduced padding

## Proposed Implementation

### `hero-product.js`

```js
export default function decorate(block) {
  const rows = [...block.children];
  if (rows[0]) rows[0].classList.add('hero-product-image');
  if (rows[1]) rows[1].classList.add('hero-product-content');
}
```

- Synchronous, minimal DOM manipulation
- Assigns semantic class names to the two rows
- Relies on CSS for layout and positioning

### `hero-product.css`

Key styling:
- Full-width wrapper override (dark background, no max-width constraint)
- Background image positioned absolutely, covering the block
- Content overlay with z-index stacking
- CTA button with dark pill style and arrow pseudo-element
- Mobile-first responsive (padding/font scaling at 900px breakpoint)
- Modern range media query notation per project stylelint rules

### Sample Authored Content (`.plain.html` format)

```html
<div class="hero-product">
  <div>
    <div>
      <picture>
        <source type="image/webp" srcset="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80">
        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80" alt="Premium wireless headphones">
      </picture>
    </div>
  </div>
  <div>
    <div>
      <h1>Experience Media Like Never Before</h1>
      <p>Enjoy award-winning stereo beats with wireless listening freedom and sleek, streamlined with premium padded and delivering first-rate playback.</p>
      <p><strong><a href="/products">Our Products</a></strong></p>
    </div>
  </div>
</div>
```

## Files to Create

| File | Action |
|------|--------|
| `blocks/hero-product/hero-product.js` | Create new |
| `blocks/hero-product/hero-product.css` | Create new |

## Checklist

- [ ] Create directory `blocks/hero-product/`
- [ ] Write `blocks/hero-product/hero-product.js` with row class decoration
- [ ] Write `blocks/hero-product/hero-product.css` with dark theme, responsive layout, CTA styling
- [ ] Run `npm run lint` (ESLint + Stylelint) to verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Confirm block follows EDS conventions (no standalone HTML pages, no demo pages)

## Key Design Decisions

- **No `text-transform: uppercase`** on heading — the design shows sentence-case/title-case, unlike the global heading style in this project. The block CSS will override with `text-transform: none`.
- **CTA uses `<strong>` wrapping** — standard EDS pattern for primary button decoration. The block styles the link within the last paragraph.
- **Background image as Row 1** — follows the standard EDS hero authoring pattern (same as the existing `hero` block in the boilerplate).
- **Product image is the background** — the right-side product image is part of the background photo composition, not a separate authored element.

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
