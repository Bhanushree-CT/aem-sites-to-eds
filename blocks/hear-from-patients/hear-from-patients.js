import { createOptimizedPicture } from '../../scripts/aem.js';

function updateActiveSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.hear-from-patients-slide');
  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== slideIndex);
  });

  const segments = block.querySelectorAll('.hear-from-patients-progress-segment');
  segments.forEach((seg, idx) => {
    seg.classList.toggle('active', idx === slideIndex);
  });

  block.dataset.activeSlide = slideIndex;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slideCount = rows.length;

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'hear-from-patients-slides';

  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const slide = document.createElement('li');
    slide.className = 'hear-from-patients-slide';
    slide.dataset.slideIndex = idx;
    slide.setAttribute('aria-hidden', idx !== 0);

    const quoteCol = cols[0];
    if (quoteCol) {
      quoteCol.className = 'hear-from-patients-quote';
      const text = quoteCol.textContent.trim();
      const alreadyQuoted = text.startsWith('“') || text.startsWith('"');
      if (!alreadyQuoted) {
        const p = quoteCol.querySelector('p') || quoteCol;
        p.textContent = `“ ${p.textContent.trim()} ”`;
      }
      slide.append(quoteCol);
    }

    const authorCol = cols[1];
    if (authorCol) {
      authorCol.className = 'hear-from-patients-author';
      const paragraphs = authorCol.querySelectorAll('p');
      if (paragraphs.length >= 2) {
        paragraphs[0].classList.add('hear-from-patients-author-name');
        paragraphs[1].classList.add('hear-from-patients-author-meta');
      } else if (paragraphs.length === 1) {
        const content = paragraphs[0].textContent;
        if (content.includes('·') || content.includes('·')) {
          const parts = content.split(/[··]/);
          paragraphs[0].textContent = parts[0].trim();
          paragraphs[0].classList.add('hear-from-patients-author-name');
          const meta = document.createElement('p');
          meta.className = 'hear-from-patients-author-meta';
          meta.textContent = parts[1]?.trim() || '';
          authorCol.append(meta);
        } else {
          paragraphs[0].classList.add('hear-from-patients-author-name');
        }
      }
      slide.append(authorCol);
    }

    const imageCol = cols[2];
    if (imageCol) {
      imageCol.className = 'hear-from-patients-image';
      const img = imageCol.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        img.closest('picture').replaceWith(optimized);
      }
      slide.append(imageCol);
    }

    slidesWrapper.append(slide);
    row.remove();
  });

  block.append(slidesWrapper);

  const progressBar = document.createElement('div');
  progressBar.className = 'hear-from-patients-progress';
  for (let i = 0; i < slideCount; i += 1) {
    const segment = document.createElement('button');
    segment.className = 'hear-from-patients-progress-segment';
    segment.setAttribute('type', 'button');
    segment.setAttribute('aria-label', `Show slide ${i + 1} of ${slideCount}`);
    if (i === 0) segment.classList.add('active');
    segment.addEventListener('click', () => {
      slidesWrapper.scrollTo({
        left: slidesWrapper.children[i].offsetLeft,
        behavior: 'smooth',
      });
    });
    progressBar.append(segment);
  }
  block.append(progressBar);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.slideIndex, 10);
        updateActiveSlide(block, index);
      }
    });
  }, { root: slidesWrapper, threshold: 0.5 });

  slidesWrapper.querySelectorAll('.hear-from-patients-slide').forEach((slide) => {
    observer.observe(slide);
  });
}
