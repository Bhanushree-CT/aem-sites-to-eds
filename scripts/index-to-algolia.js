/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
const algoliasearch = require('algoliasearch');

const {
  ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_KEY,
  AEM_ADMIN_SERVICE_TOKEN,
} = process.env;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex('eds-github-index');

async function syncAemApiToAlgolia() {
  try {
    console.log('Authenticating securely via AEM Technical Account credentials...');

    const aemApiUrl = 'https://admin.hlx.page/index/Bhanushree-CT/aem-sites-to-eds/main?limit=100';

    const response = await fetch(aemApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AEM_ADMIN_SERVICE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`AEM API request failed: ${response.statusText}`);
    }

    const payload = await response.json();

    // Look directly inside the payload results
    const rawPages = payload.results || [];

    console.log(`Mapping ${rawPages.length} active API documents...`);

    const records = rawPages.map((page) => {
      const uniquePath = page.path || page.route || '/';

      return {
        objectID: uniquePath,
        path: uniquePath,
        title: page.title || 'Untitled Page',
        description: page.description || '',
        category: page.category || 'General',
        lastModified: page.lastmodified || new Date().toISOString(),
      };
    });

    console.log(`Syncing ${records.length} direct API records over to Algolia...`);
    await index.replaceAllObjects(records);
    console.log('Success! Your enterprise search pipeline is perfectly synced.');
  } catch (error) {
    console.error('API Sync Failed:', error);
    process.exit(1);
  }
}

syncAemApiToAlgolia();
