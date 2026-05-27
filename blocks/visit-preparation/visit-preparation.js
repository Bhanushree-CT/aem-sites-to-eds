import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    cols.forEach((col, colIdx) => {
      if (colIdx === 0 && col.querySelector('picture')) {
        col.className = 'visit-preparation-icon';
      } else if (colIdx === 1) {
        col.className = 'visit-preparation-title';
      } else if (colIdx === 2) {
        col.className = 'visit-preparation-description';
      } else if (colIdx === 3) {
        col.className = 'visit-preparation-cta';
        const link = col.querySelector('a');
        if (link) {
          link.classList.add('button', 'button-outline');
        }
      } else if (col.querySelector('picture')) {
        col.className = 'visit-preparation-icon';
      } else {
        col.className = 'visit-preparation-description';
      }
      li.append(col);
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
