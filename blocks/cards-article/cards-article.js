import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);

  /* Make entire card clickable by wrapping content in the link */
  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-article-card-body');
    if (!body) return;
    const linkEl = body.querySelector('a');
    if (!linkEl) return;
    const href = linkEl.getAttribute('href');
    const label = linkEl.textContent || '';

    // Remove the link paragraph from body
    const linkP = linkEl.closest('p');
    if (linkP) linkP.remove();

    // Wrap all li children in an anchor
    const wrapper = document.createElement('a');
    wrapper.href = href;
    wrapper.className = 'cards-article-card-link';
    wrapper.setAttribute('aria-label', label);
    while (li.firstChild) wrapper.append(li.firstChild);
    li.append(wrapper);
  });
}
