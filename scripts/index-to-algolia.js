/* eslint-disable */
const algoliasearch = require('algoliasearch');

const APP_ID = process.env.ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('eds-github-index');

async function pushDataToAlgolia() {
  try {
    console.log('Fetching Edge Delivery Services index data...');

    // The quote is now perfectly wrapping the entire URL
    const response = await fetch('https://main--aem-sites-to-eds--bhanushree-ct.aem.live/query-index.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const records = data.data;

    console.log(`Found ${records.length} records. Pushing to Algolia...`);

    await index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true });

    console.log('Success! Your data is now in the cloud cabinet.');
  } catch (error) {
    console.error('Error pushing data to Algolia:', error);
    process.exit(1);
  }
}

pushDataToAlgolia();