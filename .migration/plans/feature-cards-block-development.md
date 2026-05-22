# Feature Cards Block Development Plan

## Summary

Create a new `blocks/feature-cards/` EDS block that renders a section heading area (eyebrow, heading, subtitle) above a responsive grid of feature cards. Each card contains an icon/image with colored circular background, title, description, and a CTA link with arrow. Based on the provided design reference, the block uses a clean, modern aesthetic with subtle hover effects and a light grey section background.

## Content Model (Authoring Structure)

The block expects this authored table structure from the EDS delivery pipeline:

```
| Feature Cards |
| --- |
| [icon image] | Fast Performance | Optimized for speed and efficiency... | [Learn more](url) |
| [icon image] | Secure & Reliable | Enterprise-grade security with... | [Learn more](url) |
| [icon image] | 24/7 Support | Our expert support team is always... | [Learn more](url) |
```

Each row = one card. Columns per row:
1. **Image/Icon** — `<picture>` or `<img>` element
2. **Title** — heading text (rendered as `<h3>`)
3. **Description** — paragraph text
4. **CTA** — link (`<a>` element with text like "Learn more")

The section heading ("WHY CHOOSE US", "Built for the future...", subtitle) is authored as **default content** above the block, not inside the block table.

## Visual Design (from reference image)

- **Section background:** Light grey (`#f5f5f5` / `var(--light-color)`)
- **Cards:** White background, rounded corners (16px), subtle border (`1px solid #e8e8e8`), centered text
- **Icon area:** Circular pastel background (light blue, light green, light purple) behind icon image, centered above title
- **Title:** Bold, ~20px, dark text
- **Description:** Regular weight, grey text (`#666`), centered
- **CTA:** Blue/link-colored text with arrow (→), no underline until hover
- **Hover:** Card lifts slightly (`translateY(-4px)`) with subtle shadow
- **Grid:** 3 columns on desktop, 2 on tablet, 1 on mobile

## Proposed Implementation

### `feature-cards.js`

```js
export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    const cols = [...card.children];
    card.classList.add('feature-cards-card');

    // Column 0: icon/image
    if (cols[0]) {
      cols[0].classList.add('feature-cards-icon');
    }
    // Column 1: title
    if (cols[1]) {
      cols[1].classList.add('feature-cards-title');
      const text = cols[1].textContent.trim();
      cols[1].innerHTML = `<h3>${text}</h3>`;
    }
    // Column 2: description
    if (cols[2]) {
      cols[2].classList.add('feature-cards-description');
    }
    // Column 3: CTA
    if (cols[3]) {
      cols[3].classList.add('feature-cards-cta');
      const link = cols[3].querySelector('a');
      if (link) {
        link.setAttribute('aria-label', `${link.textContent.trim()} - ${cols[1]?.textContent.trim()}`);
      }
    }
  });
}
```

**Key decisions:**
- Synchronous — no async, no render blocking
- Adds semantic class names to each column for CSS targeting
- Wraps title text in `<h3>` for proper heading hierarchy
- Adds descriptive `aria-label` to CTA links for accessibility
- Minimal DOM restructuring — decorates in place

### `feature-cards.css`

```css
.feature-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.feature-cards-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 48px 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-cards-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgb(0 0 0 / 8%);
}

.feature-cards-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
}

.feature-cards-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.feature-cards-title h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-color);
}

.feature-cards-description {
  font-size: 16px;
  line-height: 1.6;
  color: var(--link-color, #666);
  margin-bottom: 24px;
}

.feature-cards-cta a {
  color: var(--link-color);
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.feature-cards-cta a::after {
  content: "→";
}

.feature-cards-cta a:hover {
  text-decoration: underline;
}

@media (width >= 600px) {
  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 900px) {
  .feature-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Key decisions:**
- Mobile-first: 1 column → 2 at 600px → 3 at 900px
- Card hover: subtle lift + shadow for interactivity feedback
- Icon container fixed at 80×80px with `object-fit: contain`
- CTA arrow via `::after` pseudo-element (no extra markup needed)
- All selectors scoped to `.feature-cards` to prevent conflicts
- Uses project CSS variables where appropriate (`--text-color`, `--link-color`)
- Modern range notation for media queries (per project stylelint rules)

## Accessibility

- Cards use semantic `<h3>` for titles (proper heading hierarchy below section h2)
- CTA links get descriptive `aria-label` including card title context
- Hover effects are visual-only (no content hidden behind interaction)
- Color contrast: dark text on white cards meets WCAG AA
- Focus styles inherit from global `a:focus-visible` rules

## Files to Create

| File | Action |
|------|--------|
| `blocks/feature-cards/feature-cards.js` | Create new |
| `blocks/feature-cards/feature-cards.css` | Create new |

## Checklist

- [ ] Create directory `blocks/feature-cards/`
- [ ] Write `blocks/feature-cards/feature-cards.js` with semantic decoration and accessibility
- [ ] Write `blocks/feature-cards/feature-cards.css` with responsive grid, card styles, and hover effects
- [ ] Run `npm run lint` (ESLint + Stylelint) to verify no errors
- [ ] Create test content in `content/` and verify block renders in dev server preview
- [ ] Verify responsive behavior (1-col mobile, 2-col tablet, 3-col desktop)
- [ ] Verify hover effect (lift + shadow)

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
