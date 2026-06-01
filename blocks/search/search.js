let queryIndex = null;

async function fetchQueryIndex() {
  if (queryIndex) return queryIndex;
  const resp = await fetch('/query-index.json');
  if (!resp.ok) return [];
  const json = await resp.json();
  queryIndex = json.data || [];
  return queryIndex;
}

function filterResults(index, query) {
  const terms = query.toLowerCase().trim().split(/\s+/);
  return index.filter((item) => {
    const searchable = `${item.title || ''} ${item.description || ''} ${item.path || ''}`.toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}

function renderResults(container, results, query) {
  container.innerHTML = '';

  if (!query) {
    container.setAttribute('aria-live', 'polite');
    return;
  }

  if (results.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'search-no-results';
    noResults.textContent = `No results found for "${query}"`;
    container.append(noResults);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'search-results-list';

  results.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'search-result-item';

    const link = document.createElement('a');
    link.href = item.path;
    link.className = 'search-result-link';

    const title = document.createElement('h3');
    title.className = 'search-result-title';
    title.textContent = item.title || item.path;
    link.append(title);

    if (item.description) {
      const desc = document.createElement('p');
      desc.className = 'search-result-description';
      desc.textContent = item.description;
      link.append(desc);
    }

    const path = document.createElement('span');
    path.className = 'search-result-path';
    path.textContent = item.path;
    link.append(path);

    li.append(link);
    list.append(li);
  });

  container.append(list);
}

export default async function decorate(block) {
  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');
  form.addEventListener('submit', (e) => e.preventDefault());

  const label = document.createElement('label');
  label.className = 'search-label';
  label.setAttribute('for', 'search-input');
  label.textContent = 'Search';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'search-input';
  input.className = 'search-input';
  input.placeholder = 'Search...';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-describedby', 'search-status');

  const status = document.createElement('div');
  status.id = 'search-status';
  status.className = 'search-status';
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  form.append(label, input);
  block.append(form);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  resultsContainer.setAttribute('aria-live', 'polite');
  block.append(resultsContainer, status);

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = input.value.trim();
      if (!query) {
        renderResults(resultsContainer, [], '');
        status.textContent = '';
        return;
      }
      const index = await fetchQueryIndex();
      const results = filterResults(index, query);
      renderResults(resultsContainer, results, query);
      status.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
    }, 300);
  });
}
