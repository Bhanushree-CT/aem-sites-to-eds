# Product Information Block — Content-Driven Development Plan

## Summary

Create a new `blocks/product-information/` block that renders a product comparison grid with two product variants (e.g., Pill vs Pen), feature rows with decorative checkmark icons, a side-effects section with a 4-column bullet grid, and a footnote/disclaimer area. Based on the Figma design from the NovoCare Design Library.

## Figma Design Analysis

**Source:** `https://www.figma.com/design/V0Fz97pKnNre06yfzCCHes/...?node-id=16763-12724`

**Component Structure (from metadata):**
- **Frame** (1312×624): Main container
  - **Text** "Product information": H2 heading (lives outside the block table)
  - **Group 1449** (1181×248): Two-column comparison grid with 4 feature rows, separated by 1px `#e4e4e7` dividers
  - **Frame 1450** (1181×192): Side effects section (bold title + 4-column bullet list) + disclaimer text

**Design Tokens Extracted:**
- Font: Noto Sans
- Heading (product names): 20px/24px bold, letter-spacing -0.5px, color `#09090b`
- Feature text: 16px/24px medium, color `#09090b`
- Side effects title: 16px/24px bold, color `#000000`
- Side effects items: 14px/18px regular, color `#000000`
- Disclaimer: 14px/18px regular, color `#000000`
- Divider: 1px solid `#e4e4e7`
- Checkmark icon: 24×24px, border-radius 6px
- Feature row gap: 16px vertical, 24px between columns
- Side effects grid: 4-column flex-wrap, 24px gap
- Container padding: 40px top/bottom, 44px left/right
- Section gap: 32px between comparison grid and side-effects

## Reference Block Search Results

- **Columns** (Block Collection): Found — provides the base 2-column flex pattern. The `product-information` block adapts this pattern with row-based comparison grid, decorative icons, and dynamic content classification.
- **Comparison table / spec grid**: Not found in Block Collection or Block Party — custom implementation needed.

## Content Model Design

### Block Type
**Collection** — Repeating rows where each row represents a feature comparison pair, with special row types for sub-sections and disclaimers.

### Authored Table Structure (DA.live / Google Docs)

The H2 "Product information" is authored as **default content above the block table**.

| Product Information |
|---------------------|
| Wegovy Pill | Wegovy Pen |
| Daily AM Pill | Weekly Injection |
| Taken on empty stomach | Can be taken any time, with or without food. |
| Store at room temperature. | Store in the fridge (recommended). |
| Starts at $149/month (self pay). | Starts at $199/month (self pay). |
| Common side effects | • Nausea • Diarrhea • Vomiting • Constipation • Stomach (abdomen) pain • Headache • Tiredness (fatigue) • Upset stomach • Dizziness • Feeling bloated • Belching • Low blood sugar in people with type 2 diabetes • Gas • Stomach flu • Heartburn • Runny nose or sore throat |
| *The use of Wegovy® has been associated with gastrointestinal (GI) side effects...* |

### Row Classification Logic (Postel's Law)

The JS decoration dynamically classifies rows based on content characteristics:

| Row Pattern | Classification | Rendering |
|-------------|---------------|-----------|
| Row 1 (first row): two cells with bold/heading-like text | **Header row** | Product variant column headers (bold, 20px) |
| Two cells with comparable text | **Feature row** | Side-by-side with checkmark icons + divider |
| Col 1 = bold subsection title, Col 2 = `<ul>` list | **Sub-section row** | Full-width: title above, bullets in 4-col grid |
| Single cell spanning full width, or italic text | **Disclaimer row** | Full-width small text, italic styling |

## Proposed Implementation

### `product-information.js`

Key logic:
- Iterate rows and classify each based on content heuristics
- **Header row** (first row): add class `.product-information-header`
- **Feature rows** (2 cells, plain text): add `.product-information-feature`, prepend CSS-based checkmark pseudo-element
- **Sub-section row** (bold title + bullet list): add `.product-information-subsection`, restructure `<ul>` into balanced 4-column grid
- **Disclaimer row** (single cell or italic): add `.product-information-disclaimer`
- Flexible: handles missing cells, extra rows, mixed formatting

### `product-information.css`

Key properties:
- Container: `padding: 40px 44px`, `border-radius: 12px`, `border: 1px solid #e4e4e7`, white background
- Comparison grid: CSS Grid `grid-template-columns: 1fr 1fr`, `gap: 24px` column gap
- Feature rows: flex with 16px gap, bottom border `1px solid #e4e4e7`, padding `16px 0`
- Checkmark icon: `::before` pseudo-element, 24×24px, `border-radius: 6px`, `background: #f4f4f5`
- Sub-section: full-width span, bold title, bullet grid `grid-template-columns: repeat(4, 1fr)`, `gap: 24px`
- Disclaimer: full-width, 14px italic text
- Typography: Noto Sans, sizes per Figma tokens
- Responsive: stacks to 1 column below 768px, side effects goes to 2-col grid on tablet

### `_product-information.json` (Universal Editor Schema)

Repeatable group with fields:
- `pillFeature` (text) — Left column feature text
- `penFeature` (text) — Right column feature text
- `sideEffectsTitle` (text) — Sub-section heading
- `sideEffects` (richtext) — Bullet list content
- `disclaimer` (richtext) — Footnote text

## Files to Create

| File | Action |
|------|--------|
| `blocks/product-information/product-information.js` | Create new |
| `blocks/product-information/product-information.css` | Create new |
| `blocks/product-information/_product-information.json` | Create new |

## Checklist

- [ ] Create directory `blocks/product-information/`
- [ ] Write `product-information.js` — DOM restructuring with dynamic row classification (header, feature, sub-section, disclaimer), checkmark icon injection, 4-column side-effects grid reflow
- [ ] Write `product-information.css` — Scoped under `.product-information`, 40px/44px padding, 32px section gaps, 2-column comparison grid, 4-column bullet grid, dividers, responsive stacking
- [ ] Create `_product-information.json` — Universal Editor schema with flexible field groups
- [ ] Run ESLint on `product-information.js` — verify no errors
- [ ] Run Stylelint on `product-information.css` — verify no errors
- [ ] Verify JS syntax with `node --check`
- [ ] Generate authored plain HTML content for index page

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
