/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/
 * Selector: .faq-list
 * Generated: 2026-05-21
 *
 * FAQ accordion with expandable details/summary items.
 * Each item has a question (summary > span) and answer (div.faq-answer > p).
 * Maps to 2-column accordion table: Title cell | Content cell per row.
 */
export default function parse(element, { document }) {
  // Extract all FAQ items from details elements
  const faqItems = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  faqItems.forEach((item) => {
    // Extract the question text from summary > span
    const questionSpan = item.querySelector('summary .faq-question span, summary span, summary');
    // Extract the answer content from .faq-answer
    const answerDiv = item.querySelector('.faq-answer, div:not(.faq-question)');

    // Build title cell - use the question text
    const titleCell = [];
    if (questionSpan) {
      const titleEl = document.createElement('p');
      titleEl.textContent = questionSpan.textContent.trim();
      titleCell.push(titleEl);
    }

    // Build content cell - preserve answer paragraphs
    const contentCell = [];
    if (answerDiv) {
      const paragraphs = answerDiv.querySelectorAll('p');
      if (paragraphs.length > 0) {
        paragraphs.forEach((p) => {
          contentCell.push(p);
        });
      } else {
        // Fallback: use the div content directly
        const contentEl = document.createElement('p');
        contentEl.textContent = answerDiv.textContent.trim();
        contentCell.push(contentEl);
      }
    }

    // Only add row if we have at least a title
    if (titleCell.length > 0) {
      cells.push([titleCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
