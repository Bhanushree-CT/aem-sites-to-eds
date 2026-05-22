/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-testimonial
 * Base block: tabs
 * Source selector: .tabs-wrapper
 * Generated: 2026-05-21
 *
 * Extracts a tabbed testimonial section with multiple tabs.
 * Each tab has a person's image, name, role, and quote.
 * Tab labels come from the tab-menu buttons (person name + role).
 * Tab content comes from the tab-pane panels (image, name, role, quote).
 *
 * Target structure (from block library):
 *   | tabs-testimonial |                    |
 *   | Tab Label        | Tab Content        |
 *   | Tab Label        | Tab Content        |
 *   ...
 */
export default function parse(element, { document }) {
  // Extract tab panes (content panels)
  const tabPanes = element.querySelectorAll('.tabs-content .tab-pane');

  // Extract tab menu buttons (labels)
  const tabButtons = element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button');

  const cells = [];

  tabPanes.forEach((pane, index) => {
    // --- Tab Label (first cell) ---
    // Use the person's name from the tab button as the label
    let tabLabel = '';
    const button = tabButtons[index];
    if (button) {
      const nameEl = button.querySelector('.paragraph-sm strong, strong');
      tabLabel = nameEl ? nameEl.textContent.trim() : `Tab ${index + 1}`;
    } else {
      // Fallback: get name from pane content
      const paneName = pane.querySelector('.paragraph-xl strong, strong');
      tabLabel = paneName ? paneName.textContent.trim() : `Tab ${index + 1}`;
    }

    // --- Tab Content (second cell) ---
    // Build content: image, name, role, quote
    const contentElements = [];

    // Image
    const image = pane.querySelector('img.cover-image, img');
    if (image) {
      const img = document.createElement('img');
      img.src = image.src || image.getAttribute('src');
      img.alt = image.alt || image.getAttribute('alt') || '';
      contentElements.push(img);
    }

    // Name (bold)
    const nameDiv = pane.querySelector('.paragraph-xl strong, strong');
    if (nameDiv) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameDiv.textContent.trim();
      p.appendChild(strong);
      contentElements.push(p);
    }

    // Role
    const gridContent = pane.querySelector('.grid-layout > div:nth-child(2)');
    if (gridContent) {
      const nameContainer = gridContent.querySelector(':scope > div:first-child');
      if (nameContainer) {
        // Role is the div after the name div
        const roleDiv = nameContainer.querySelector(':scope > div:nth-child(2)');
        if (roleDiv && !roleDiv.querySelector('strong')) {
          const p = document.createElement('p');
          p.textContent = roleDiv.textContent.trim();
          contentElements.push(p);
        }
      }
    }

    // Quote
    const quote = pane.querySelector('p.paragraph-xl, p');
    if (quote) {
      const p = document.createElement('p');
      p.textContent = quote.textContent.trim();
      contentElements.push(p);
    }

    cells.push([tabLabel, contentElements]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
