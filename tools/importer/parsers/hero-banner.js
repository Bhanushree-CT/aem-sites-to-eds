/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Selector: section.inverse-section
 * Generated: 2026-05-21
 *
 * CTA banner hero with background image, dark overlay, heading, paragraph, and CTA button.
 * Structure:
 *   Row 1: Background image
 *   Row 2: Heading + description text + CTA link
 */
export default function parse(element, { document }) {
  // Extract background image (cover-image class, fallback to any img)
  const bgImage = element.querySelector('img.cover-image, img[class*="background"], img');

  // Extract heading (h2 styled as h1 via h1-heading class, fallback to h1/h2/h3)
  const heading = element.querySelector('h2.h1-heading, h1.h1-heading, h1, h2, h3');

  // Extract description paragraph (subheading class, fallback to first p in card-body)
  const description = element.querySelector('p.subheading, .card-body p, .utility-text-on-overlay p, p');

  // Extract CTA links from button-group container
  const buttonGroup = element.querySelector('.button-group');
  const ctaLinks = buttonGroup
    ? Array.from(buttonGroup.querySelectorAll('a.button, a'))
    : Array.from(element.querySelectorAll('a.button, a.inverse-button, a'));

  // Build cells array matching hero block structure:
  // Row 1: background image
  // Row 2: heading + description + CTA(s)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Single content cell with heading, description, and CTA links
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
