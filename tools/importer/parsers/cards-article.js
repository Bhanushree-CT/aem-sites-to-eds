/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Description: Grid of article cards. Each card is an anchor link containing
 * an article image, category tag, date, and h3 title linking to a blog post.
 * Generated: 2026-05-21
 */
export default function parse(element, { document }) {
  // Each article card is an <a> with class "article-card card-link"
  const cards = element.querySelectorAll('a.article-card, a.card-link');

  const cells = [];

  cards.forEach((card) => {
    // Extract image from .article-card-image or fallback to any img
    const img = card.querySelector('.article-card-image img, img.cover-image, img');

    // Build body content: category tag, date, and heading
    const bodyContent = [];

    // Category tag
    const tag = card.querySelector('.article-card-meta .tag, .tag');
    if (tag) {
      const tagEl = document.createElement('p');
      tagEl.textContent = tag.textContent.trim();
      bodyContent.push(tagEl);
    }

    // Date
    const date = card.querySelector('.article-card-meta .paragraph-sm, .utility-text-secondary');
    if (date) {
      const dateEl = document.createElement('p');
      dateEl.textContent = date.textContent.trim();
      bodyContent.push(dateEl);
    }

    // Heading (h3)
    const heading = card.querySelector('h3, .h4-heading, [class*="heading"]');
    if (heading) {
      bodyContent.push(heading);
    }

    // Create a link wrapping the body content to preserve the card's href
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading ? heading.textContent.trim() : '';
      bodyContent.push(link);
    }

    // Build row: [image cell, body cell]
    const imageCell = img ? [img] : [];
    cells.push([imageCell, bodyContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
