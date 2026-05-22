export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    const cols = [...card.children];
    card.classList.add('feature-cards-card');

    if (cols[0]) {
      cols[0].classList.add('feature-cards-icon');
    }
    if (cols[1]) {
      cols[1].classList.add('feature-cards-title');
      const text = cols[1].textContent.trim();
      cols[1].innerHTML = `<h3>${text}</h3>`;
    }
    if (cols[2]) {
      cols[2].classList.add('feature-cards-description');
    }
    if (cols[3]) {
      cols[3].classList.add('feature-cards-cta');
      const link = cols[3].querySelector('a');
      if (link) {
        link.setAttribute('aria-label', `${link.textContent.trim()} - ${cols[1]?.textContent.trim()}`);
      }
    }
  });
}
