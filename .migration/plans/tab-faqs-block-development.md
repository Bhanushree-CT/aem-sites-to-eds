# Tab FAQs Block — Content-Driven Development Plan

## Summary

Create a new `blocks/tab-faqs/` block that combines horizontal tab navigation with collapsible FAQ accordion items. Authors organize FAQ questions into named tab categories using a 3-column table. The block restructures this flat table into a tabbed interface where each tab reveals its own set of expandable Q&A accordion items.

## Reference Block Analysis

### Block Collection: Tabs
- Uses `toClassName` from `aem.js` for ID generation
- Uses `moveInstrumentation` from `scripts.js` (NOT available in this project — must remove)
- Creates `role="tablist"` with `role="tab"` buttons
- Tab panels use `role="tabpanel"` with `aria-hidden` toggling
- First tab is active by default

### Block Collection: Accordion (not found, but pattern known from project)
- Uses `<details>/<summary>` HTML elements for native expand/collapse
- Each item has a question (summary) and answer (content)
- CSS handles open/closed states with transitions

**Hybrid approach for tab-faqs:**
- Tab switching logic from the Tabs reference (adapted without `moveInstrumentation`)
- FAQ items within each panel use native `<details>/<summary>` for accessibility and zero-JS accordion behavior

## Content Model (3-column authored table)

| Tab FAQs |
|---|
| **Tab Name** | **Question** | **Answer** |
| General | What is AEM EDS? | A modern content delivery architecture... |
| | How is authoring different? | Document authoring uses tools like Word... |
| Pricing | How much does it cost? | Pricing varies by tier... |
| | Are there free trials? | Yes, a 30-day trial is available... |
| Features | What blocks are supported? | All standard EDS blocks plus custom... |

**Grouping logic:** Column 1 defines the tab name. Subsequent rows with blank Column 1 inherit the previous tab name. This creates natural content grouping.

**Postel's Law flexibility:**
- If Column 1 is populated on every row → each row treated as belonging to the tab named in that row
- If only 1 column exists (all content in one cell) → treat as a single-tab FAQ with that cell as the question
- If Column 2 is missing → skip that row gracefully
- If Column 3 is missing → create accordion item with question only (empty answer)

## Visual Design (from mockup)

- **Tabs:** Horizontal tab bar at top, active tab has bottom border highlight, uppercase labels
- **FAQ Items:** Rounded cards with border, expand/collapse with +/− icons
- **Questions:** Bold, numbered display (handled by CSS counter)
- **Answers:** Regular weight paragraph text below question
- **Spacing:** Generous padding within cards, gap between items

## Proposed Implementation

### `tab-faqs.js`

```js
import { toClassName } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const tabs = new Map();
  let currentTab = '';

  // Group rows by tab name (Column 1)
  rows.forEach((row) => {
    const cols = [...row.children];
    const tabName = cols[0]?.textContent.trim();
    const question = cols[1]?.innerHTML.trim() || cols[0]?.innerHTML.trim();
    const answer = cols[2]?.innerHTML.trim() || '';

    if (tabName) currentTab = tabName;
    if (!currentTab) currentTab = 'General';
    if (!tabs.has(currentTab)) tabs.set(currentTab, []);

    if (question) {
      tabs.get(currentTab).push({ question, answer });
    }
  });

  // Build tablist
  block.textContent = '';
  const tablist = document.createElement('div');
  tablist.className = 'tab-faqs-list';
  tablist.setAttribute('role', 'tablist');

  let firstPanel = true;
  tabs.forEach((items, tabName) => {
    const id = toClassName(tabName);

    // Tab button
    const button = document.createElement('button');
    button.className = 'tab-faqs-tab';
    button.id = `tab-${id}`;
    button.textContent = tabName;
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', firstPanel);
    button.addEventListener('click', () => { /* tab switching */ });
    tablist.append(button);

    // Tab panel with accordion items
    const panel = document.createElement('div');
    panel.className = 'tab-faqs-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', !firstPanel);

    items.forEach(({ question, answer }) => {
      const details = document.createElement('details');
      details.className = 'tab-faqs-item';
      const summary = document.createElement('summary');
      summary.className = 'tab-faqs-question';
      summary.innerHTML = question;
      details.append(summary);
      if (answer) {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'tab-faqs-answer';
        answerDiv.innerHTML = answer;
        details.append(answerDiv);
      }
      panel.append(details);
    });

    block.append(panel);
    firstPanel = false;
  });

  block.prepend(tablist);
}
```

### `tab-faqs.css`

Key properties:
- Tab list: flexbox row, gap between tabs, bottom border on active
- Tab buttons: uppercase, bold, padding, background transitions
- Panels: hidden via `aria-hidden`, padding
- FAQ items: `<details>` with border, `border-radius: 12px`, padding
- Summary (question): bold, flex with space-between for +/− icon
- Summary `::marker` hidden, custom +/− via `::after` pseudo-element
- Answer: padding-top, standard text color
- CSS counter for numbering questions
- Responsive: full-width tabs on mobile, scrollable on overflow

### `_tab-faqs.json` (Universal Editor schema)

Repeatable group with fields:
- `tabName` (text) — category/tab label
- `question` (text) — FAQ question heading
- `answer` (richtext) — FAQ answer content

## Files to Create

| File | Action |
|------|--------|
| `blocks/tab-faqs/tab-faqs.js` | Create new |
| `blocks/tab-faqs/tab-faqs.css` | Create new |
| `blocks/tab-faqs/_tab-faqs.json` | Create new |

## Checklist

- [ ] Create directory `blocks/tab-faqs/`
- [ ] Write `blocks/tab-faqs/tab-faqs.js` — hybrid tabs+accordion DOM restructuring with Postel's Law flexibility
- [ ] Write `blocks/tab-faqs/tab-faqs.css` — tab bar, accordion items with +/− icons, responsive layout, CSS counters
- [ ] Create `blocks/tab-faqs/_tab-faqs.json` — Universal Editor schema with repeatable FAQ group
- [ ] Run ESLint on `tab-faqs.js` — verify no errors
- [ ] Run Stylelint on `tab-faqs.css` — verify no errors
- [ ] Verify JS syntax with `node --check`

## Accessibility

- Tab list uses `role="tablist"` with `role="tab"` buttons
- Tab panels use `role="tabpanel"` with `aria-labelledby` linking to tab button
- `aria-selected` and `aria-hidden` for state management
- FAQ items use native `<details>/<summary>` (built-in keyboard and screen reader support)
- Focus visible styles on tab buttons and summary elements

## Execution

This plan requires Execute mode to implement. Switch to Execute mode to proceed with file creation.
