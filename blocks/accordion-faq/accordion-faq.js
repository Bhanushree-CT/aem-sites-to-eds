/*
 * Accordion FAQ Block
 * Recreate an FAQ accordion with details/summary pattern
 * Two-column layout: heading on left, accordion items on right (desktop)
 */

export default function decorate(block) {
  // Create accordion items column
  const itemsCol = document.createElement('div');
  itemsCol.className = 'accordion-faq-items';

  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);

    // add plus/minus icon
    const icon = document.createElement('span');
    icon.className = 'accordion-faq-icon';
    icon.setAttribute('aria-hidden', 'true');
    summary.append(icon);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    itemsCol.append(details);
  });

  // Pull preceding heading content into the block for two-column layout
  const wrapper = block.closest('.accordion-faq-wrapper');
  const headingWrapper = wrapper?.previousElementSibling;
  const headingCol = document.createElement('div');
  headingCol.className = 'accordion-faq-heading';

  if (headingWrapper && headingWrapper.classList.contains('default-content-wrapper')) {
    // Move heading content into the block
    headingCol.append(...headingWrapper.children);
    headingWrapper.remove();
  }

  // Clear block and rebuild with two columns
  block.textContent = '';
  block.append(headingCol, itemsCol);
}
