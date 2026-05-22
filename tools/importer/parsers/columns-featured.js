/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-featured
 * Base block: columns
 * Description: Featured article section with two columns - large image on left,
 *              breadcrumb + heading + author/date metadata on right.
 * Source: https://wknd-trendsetters.site/
 * Selector: main > section.section:nth-of-type(1)
 * Generated: 2026-05-21
 */
export default function parse(element, { document }) {
  // The section contains a grid layout with two child divs (columns)
  const gridLayout = element.querySelector('.grid-layout');
  const columns = gridLayout ? gridLayout.querySelectorAll(':scope > div') : element.querySelectorAll('.container > div > div');

  // Column 1: Image (left side)
  const leftCol = columns[0];
  const image = leftCol ? leftCol.querySelector('img.cover-image, img[class*="cover"], img') : null;

  // Column 2: Breadcrumb + Heading + Metadata (right side)
  const rightCol = columns[1];

  // Build content for the right column cell
  const rightContent = [];

  if (rightCol) {
    // Breadcrumb navigation
    const breadcrumbs = rightCol.querySelector('.breadcrumbs');
    if (breadcrumbs) {
      // Create a paragraph with breadcrumb links separated by chevron
      const breadcrumbLinks = breadcrumbs.querySelectorAll('a.text-link, a');
      const breadcrumbP = document.createElement('p');
      breadcrumbLinks.forEach((link, index) => {
        if (index > 0) {
          breadcrumbP.append(document.createTextNode(' > '));
        }
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        breadcrumbP.appendChild(a);
      });
      rightContent.push(breadcrumbP);
    }

    // Heading
    const heading = rightCol.querySelector('h2, h1, h3, [class*="heading"]');
    if (heading) {
      rightContent.push(heading);
    }

    // Author and date metadata
    const metaContainer = rightCol.querySelector('div[style*="margin-top"]');
    const metaDiv = metaContainer || rightCol.querySelector('.flex-horizontal')?.parentElement;

    if (metaDiv) {
      // Author line: "By Taylor Brooks"
      const authorRow = metaDiv.querySelector('.flex-horizontal');
      if (authorRow) {
        const authorSpans = authorRow.querySelectorAll('span');
        if (authorSpans.length >= 2) {
          const authorP = document.createElement('p');
          authorP.textContent = `${authorSpans[0].textContent.trim()} ${authorSpans[1].textContent.trim()}`;
          rightContent.push(authorP);
        }
      }

      // Date/read time line: "June 12, 2024 . 4 min read"
      const dateRow = metaDiv.querySelector('.flex-horizontal.flex-gap-xxs.utility-margin-top-0-5rem, .flex-horizontal:nth-child(2)');
      if (dateRow) {
        const dateSpans = dateRow.querySelectorAll('span');
        if (dateSpans.length > 0) {
          const dateP = document.createElement('p');
          const dateParts = [];
          dateSpans.forEach((span) => {
            dateParts.push(span.textContent.trim());
          });
          dateP.textContent = dateParts.join(' ');
          rightContent.push(dateP);
        }
      }
    }
  }

  // Build cells array: one row with two columns (image | content)
  const cells = [];

  const leftCell = [];
  if (image) {
    leftCell.push(image);
  }

  cells.push([leftCell, rightContent]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
