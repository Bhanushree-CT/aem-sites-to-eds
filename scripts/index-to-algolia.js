/* eslint-disable no-console */
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

    const aemApiUrl = 'https://admin.hlx.page/index/Bhanushree-CT/aem-sites-to-eds/main';

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
    const rawPages = payload.results || [];

    const records = rawPages.map((page) => ({
      objectID: page.path,
      path: page.path,
      title: page.title || 'Untitled Page',
      description: page.description || '',
      category: page.category || 'General',
      lastModified: page.lastmodified || new Date().toISOString(),
    }));

    console.log(`Syncing ${records.length} direct API records over to Algolia...`);
    await index.replaceAllObjects(records);
    console.log('Success! Your enterprise search pipeline is perfectly synced.');
  } catch (error) {
    console.error('API Sync Failed:', error);
    process.exit(1);
  }
}

syncAemApiToAlgolia();
