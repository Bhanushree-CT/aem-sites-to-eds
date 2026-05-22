/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-gallery
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Selector: .secondary-section .desktop-4-column.grid-gap-sm
 * Generated: 2026-05-21
 *
 * Description: Image-only gallery grid with square aspect-ratio images.
 * Each card row contains a single image (no text content).
 * Source structure: div.grid-layout > div.utility-aspect-1x1 > img.cover-image
 */
export default function parse(element, { document }) {
  // Extract all gallery images from aspect-ratio containers
  const imageContainers = element.querySelectorAll('.utility-aspect-1x1, [class*="aspect-"]');
  const images = [];

  imageContainers.forEach((container) => {
    const img = container.querySelector('img');
    if (img) {
      images.push(img);
    }
  });

  // Fallback: if no aspect-ratio containers found, try direct img children
  if (images.length === 0) {
    const directImages = element.querySelectorAll('img');
    directImages.forEach((img) => {
      images.push(img);
    });
  }

  // Build cells array - each row has the image in cell 1 and empty text in cell 2
  // This follows the standard Cards block 2-column structure (image | text)
  const cells = [];

  images.forEach((img) => {
    // Clone image to preserve src and alt attributes
    const imgClone = img.cloneNode(true);
    // Each card row: [image, empty text cell] matching Cards 2-column layout
    cells.push([imgClone, '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
