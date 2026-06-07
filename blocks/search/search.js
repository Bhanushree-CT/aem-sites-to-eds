/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import algoliasearch from 'https://cdn.jsdelivr.net/npm/algoliasearch@4.24.0/dist/algoliasearch.esm.browser.js';

// eslint-disable-next-line import/no-unresolved
import 'https://cdn.jsdelivr.net/npm/instantsearch.js@4.60.0/dist/instantsearch.production.min.js';

export default async function decorate(block) {
  block.textContent = '';

  // Load the Algolia CSS
  const algoliaStyle = document.createElement('link');
  algoliaStyle.rel = 'stylesheet';
  algoliaStyle.href = 'https://cdn.jsdelivr.net/npm/instantsearch.css@8.1.0/themes/satellite-min.css';
  document.head.append(algoliaStyle);

  // Build the DOM elements
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.style.display = 'flex';
  searchContainer.style.gap = '20px';
  searchContainer.style.width = '100%';

  const sidebar = document.createElement('div');
  sidebar.className = 'search-sidebar';
  sidebar.style.width = '250px';
  sidebar.innerHTML = `
    <h3 style="margin-top: 0;">Categories</h3>
    <div id="category-filters"></div>
  `;

  const mainArea = document.createElement('div');
  mainArea.className = 'search-main';
  mainArea.style.flex = '1';
  mainArea.innerHTML = `
    <div id="searchbox"></div>
    <div id="hits" style="margin-top: 20px;"></div>
  `;

  searchContainer.append(sidebar, mainArea);
  block.appendChild(searchContainer);

  try {
    // FIXED: Using object destructuring to satisfy the prefer-destructuring rule
    const { instantsearch } = window;

    // Connect to Algolia
    const searchClient = algoliasearch('EX4T3T2OE1', '89ac8a6eaa175d2683eb6c95c1808ba2');

    const search = instantsearch({
      indexName: 'eds-github-index',
      searchClient,
    });

    search.addWidgets([
      instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search for articles, products, etc...',
      }),

      instantsearch.widgets.refinementList({
        container: '#category-filters',
        attribute: 'category',
      }),

      instantsearch.widgets.hits({
        container: '#hits',
        templates: {
          item(hit, { html, components }) {
            return html`
              <article class="search-result-card" style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="margin: 0 0 10px 0;">${components.Highlight({ hit, attribute: 'title' })}</h2>
                <p style="margin: 0 0 10px 0;">${hit.description || ''}</p>
                <a href="${hit.path}" class="read-more">Read more</a>
              </article>
            `;
          },
        },
      }),
    ]);

    search.start();
    console.log('Algolia InstantSearch successfully started!');
  } catch (err) {
    console.error('Algolia initialization failed:', err);
  }
}
