export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const colCount = cols.length;
    const firstColText = cols[0]?.textContent.trim() || '';
    const hasList = cols[1]?.querySelector('ul, ol');
    const hasItalic = cols[0]?.querySelector('em') || firstColText.startsWith('*');
    const isSingleCell = colCount === 1;

    if (index === 0 && colCount === 2) {
      row.classList.add('product-information-header');
    } else if (isSingleCell || hasItalic) {
      row.classList.add('product-information-disclaimer');
    } else if (hasList) {
      row.classList.add('product-information-subsection');
      const list = cols[1].querySelector('ul, ol');
      if (list) {
        const items = [...list.querySelectorAll('li')];
        const gridContainer = document.createElement('div');
        gridContainer.className = 'product-information-grid';
        const colSize = Math.ceil(items.length / 4);
        for (let i = 0; i < 4; i += 1) {
          const colList = document.createElement('ul');
          const slice = items.slice(i * colSize, (i + 1) * colSize);
          slice.forEach((item) => colList.append(item));
          gridContainer.append(colList);
        }
        cols[1].textContent = '';
        cols[1].append(gridContainer);
      }
    } else if (colCount === 2) {
      row.classList.add('product-information-feature');
    }
  });
}
