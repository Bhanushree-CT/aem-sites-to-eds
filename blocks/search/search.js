// eslint-disable-next-line import/no-unresolved
import algoliasearch from 'https://cdn.jsdelivr.net/npm/algoliasearch@4.20.0/dist/algoliasearch-lite.esm.browser.js';
// eslint-disable-next-line import/no-unresolved
import instantsearch from 'https://cdn.jsdelivr.net/npm/instantsearch.js@4.60.0/dist/instantsearch.production.min.js';

export default async function decorate(block) {
  // Clear any default text the author might have typed in the block
  block.innerHTML = '';

  // Load the Algolia CSS dynamically into the document head
  const algoliaStyle = document.createElement('link');
  algoliaStyle.rel = 'stylesheet';
  algoliaStyle.href = 'https://cdn.jsdelivr.net/npm/instantsearch.css@8.1.0/themes/satellite-min.css';
  document.head.append(algoliaStyle);

  // Build the HTML scaffolding using pure JavaScript
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.style.display = 'flex';
  searchContainer.style.gap = '20px';

  // Build the Left Sidebar (Filters)
  const sidebar = document.createElement('div');
  sidebar.className = 'search-sidebar';
  sidebar.style.width = '250px';
  sidebar.innerHTML = `
    <h3>Categories</h3>
    <div id="category-filters"></div>
  `;

  // Build the Right Main Area (Search Box + Results)
  const mainArea = document.createElement('div');
  mainArea.className = 'search-main';
  mainArea.style.flex = '1';
  mainArea.innerHTML = `
    <div id="searchbox"></div>
    <div id="hits" style="margin-top: 20px;"></div>
  `;

  // Attach everything to the EDS block on the page
  searchContainer.append(sidebar, mainArea);
  block.append(searchContainer);

  // Initialize Algolia InstantSearch
  // REMEMBER: Use your SEARCH KEY here, not your Admin Key!
  const searchClient = algoliasearch('EX4T3T2OE1', '89ac8a6eaa175d2683eb6c95c1808ba2');

  const search = instantsearch({
    indexName: 'eds-github-index',
    searchClient,
  });

  // Add the Lego pieces (Widgets)
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
            <article class="search-result-card">
              <h2>${components.Highlight({ hit, attribute: 'title' })}</h2>
              <p>${hit.description}</p>
              <a href="${hit.path}" class="read-more">Read more</a>
            </article>
          `;
        },
      },
    }),
  ]);

  // Turn it on!
  search.start();
}
