/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Selector: header.section.secondary-section
 * Generated: 2026-05-21
 *
 * Two-column hero layout:
 * - Left: h1 heading, subheading paragraph, 2 CTA buttons (primary + secondary)
 * - Right: Grid of 3 cover images
 */
export default function parse(element, { document }) {
  // Extract heading (h1 with class h1-heading, fallback to any h1/h2)
  const heading = element.querySelector('h1.h1-heading, h1, h2');

  // Extract subheading paragraph (p with class subheading, fallback to first p)
  const subheading = element.querySelector('p.subheading, p');

  // Extract CTA buttons from button-group container
  const buttonGroup = element.querySelector('.button-group');
  const ctaLinks = buttonGroup
    ? Array.from(buttonGroup.querySelectorAll('a.button, a'))
    : Array.from(element.querySelectorAll('a.button, a'));

  // Extract cover images from the image grid (second grid child)
  const imageGridContainer = element.querySelectorAll('.grid-layout .grid-layout');
  let images = [];
  if (imageGridContainer.length > 0) {
    // Images are inside a nested grid-layout
    images = Array.from(imageGridContainer[0].querySelectorAll('img.cover-image, img'));
  } else {
    // Fallback: grab all images directly
    images = Array.from(element.querySelectorAll('img.cover-image, img'));
  }

  // Build content cell (left column): heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  // Build image cell (right column): all cover images
  const imageCell = [];
  if (images.length > 0) imageCell.push(...images);

  // Build cells array: single row with two columns (content | images)
  const cells = [];
  if (imageCell.length > 0) {
    cells.push([contentCell, imageCell]);
  } else {
    // Fallback: single column if no images found
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
